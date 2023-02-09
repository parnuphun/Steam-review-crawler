const puppeteer = require('puppeteer')
const moment = require('moment')
const exportCsv = require('./exportCsvFile')

let templateCaseName = 'twoSmall'
let userStatus = 'online'
let pageIndex = 1
let continouse = true
let userCount = 1

async function scrap(steamUrl){
    // open 
    const browser = await puppeteer.launch({ 
        headless: false,
        timeout: 10000
    });
    const page = await browser.newPage(); 
    // await page.goto('https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent')
    await page.goto(steamUrl)

    
    // check button cover page
    // await btnGate(page)

    let users = []
    while(continouse){
        // จำนวนแถวทุ้งหมดใน 1 หน้า
        const totolRowPage = await getTotalRowInPage(page)
        // console.log('page '+pageIndex+' have ',totolRowPage,' rows'); 
        // await autoSrollPage(page)
        
        for(let pageRowIndex = 1 ; pageRowIndex <= totolRowPage ; pageRowIndex++){
            // จำนวน user ในแถว
            const totalUserInRow = await checkTemplate(page,pageRowIndex)
            // console.log('page '+pageIndex + ' row ', pageRowIndex ,' have ', totalUserInRow ,' user');
            
            for(let userIndex = 1; userIndex <= totalUserInRow; userIndex++){
                // console.log('user คนที่ ', userIndex);
                let user = {}

                // get date
                let dateSL = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div`
                let waitDateSL = await page.waitForSelector(dateSL)
                let date = await page.evaluate(el => el.textContent , waitDateSL)
                if(date.includes('2021')){
                    continouse = false 
                    break ;
                }
                if(date.includes('ธันวาคม')){
                    date = date.replace('โพสต์: ','') + ' 2565'
                    date = moment.parseZone(date,'DD MMMM YYYY','th')
                    user.date = moment(date).add('-543','year').format('L')
                }else{
                    date = date.replace('Posted: ','') + ' 2022'
                    date = moment.parseZone(date,'DD MMMM YYYY','en')
                    user.date = moment(date).format('L')
                }

                // get username 
                let statusSelectorCheck = await checkUserStatus(page,pageRowIndex,userIndex)
                let waiteStatusSL = await page.waitForSelector(statusSelectorCheck)
                let username = await page.evaluate(el => el.textContent , waiteStatusSL)
                user.username = username
                
                // get review 
                let reviewSL = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent`
                let waitReviewSL = await page.waitForSelector(reviewSL)
                let review = await page.evaluate(el => el.textContent , waitReviewSL)
                user.review = review
                
                // get avartar 
                let avartarSL = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > a > div.appHubIconHolder.${userStatus} > img`
                await page.waitForSelector(avartarSL)
                let avartar = await page.$eval(avartarSL, el => el.getAttribute('src'))
                user.avartar = avartar 
                
                // get vote review
                let voteSL = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`
                await page.waitForSelector(voteSL)
                let vote = await page.$eval(voteSL,el => el.getAttribute('src'));
                if(vote.includes('thumbsUp')){
                    vote = '+'
                }else if(vote.includes('thumbsDown')){
                    vote = '-'
                }else{
                    vote = 'cant read value'
                }
                user.vote = vote
                
                users.push(user)
                console.log(`page: ${pageIndex} row: ${pageRowIndex} user: ${userCount} ${username} success !!`);
                userCount++
            }
        }
        // if(pageIndex === 10){
        //     break;
        // }
        previousHeight = await page.evaluate('document.body.scrollHeight')
        try {
            await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`,{ timeout: 5000 });
        } catch (error) {
            break ;
        }
        try {
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`,{ timeout: 5000 })
        } catch (error) {
            break ;
        }
        pageIndex ++
        
    }
    await browser.close() // close 
    // console.log(users);
    console.log('Total Reviews : ',users.length);
    // await exportCsv(users)
    console.log('end');
    return users
}

// *** row type
//  1. #page_?_row_?_template_twoSmall
//  2. #page_?_row_?_template_threeSmall
//  3. #page_?_row_?_template_smallFallback
//  4. #page_?_row_?_template_mediumFallback
//  5. #page_?_row_?_template_largeFallback
async function checkTemplate(page,pageRowIndex){
    templateCaseName = 'twoSmall'
    return await page.$$eval(`#page_${pageIndex}_row_${pageRowIndex}_template_twoSmall > div`, (el)=>{
        return el.filter(el => el.hasAttribute('data-panel')).length  // in user review must be attr data-panel 
    })
    // 2. threeSmall Case 
    .then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'threeSmall'
            return page.$$eval(`#page_${pageIndex}_row_${pageRowIndex}_template_threeSmall > div`, (el)=>{
                return el.filter(el => el.hasAttribute('data-panel')).length
            })
        }else{
            return result
        }
        // 3. smallFallback
    }).then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'smallFallback'
            return page.$$eval(`#page_${pageIndex}_row_${pageRowIndex}_template_smallFallback > div`, (el)=>{
                return el.filter(el => el.hasAttribute('data-panel')).length
            })
        }else{
            return result
        }
    })
    // 4. mediumFallback
    .then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'mediumFallback'
            return page.$$eval(`#page_${pageIndex}_row_${pageRowIndex}_template_mediumFallback > div`, (el)=>{
                return el.filter(el => el.hasAttribute('data-panel')).length
            })
        }else{
            return result
        }
    })
    // 5. largeFallback
    .then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'largeFallback'
            return page.$$eval(`#page_${pageIndex}_row_${pageRowIndex}_template_largeFallback > div`, (el)=>{
                return el.filter(el => el.hasAttribute('data-panel')).length
            })
        }else{
            return result
        }
    })
}

// *** user status type 
//  1. online
//  2. offline
//  3. in-game 
async function checkUserStatus(page,pageRowIndex,userIndex){
    let statusSelectorCheck = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.online.ellipsis > a:nth-child(2)`            
    
    // case 1 online 
    userStatus = 'online'
    await page.$$eval(statusSelectorCheck , el => el.length)
    // case 2 in-game
    .then((result)=>{
        if(result === 0){
            userStatus = 'in-game'
            statusSelectorCheck = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.in-game.ellipsis > a:nth-child(2)`
            return page.$$eval(statusSelectorCheck , el => el.length)
        }else{
            return result
        }
    })
    // case 3 offline
    .then((result)=>{
        if(result === 0){
            userStatus = 'offline'
            statusSelectorCheck = `#page_${pageIndex}_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.offline.ellipsis > a:nth-child(2)`
            return page.$$eval(statusSelectorCheck,el => el.length)
        }else{
            return result
        }
    })
    
    return statusSelectorCheck
}

// get total row per page
async function getTotalRowInPage(page){
    return page.$$eval(`#page${pageIndex} > div`, el => el.length)
}

async function btnGate(page){
    return page.$$eval(`#age_gate_btn_continue` , el => el.length).then(async (result)=>{
        if(result === 0){
            continouse = false
        }else {
            const btnGate = await page.$('#age_gate_btn_continue')
            await btnGate.evaluate( btnGate => btnGate.click())
        }
    })
}

module.exports = scrap