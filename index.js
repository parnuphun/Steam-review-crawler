const puppeteer = require('puppeteer')

let templateCaseName = 'twoSmall'
let userStatus = 'online'

async function scrap(){
    
    const browser = await puppeteer.launch(); // open brownser
    const page = await browser.newPage(); // open new tap 
    await page.goto('https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent')

    let users = []

    // จำนวนแถวทุ้งหมดใน 1 หน้า
    const totolRowPage = await page.$$eval('#page1 > div', el => el.length)
    console.log('page 1 have ',totolRowPage,' rows'); 


    for(let pageRowIndex = 1 ; pageRowIndex <= totolRowPage ; pageRowIndex++){
        // จำนวน user ในแถว
        const totalUserInRow = await checkTemplate(page,pageRowIndex)
        console.log('page 1 row ', pageRowIndex ,' have ', totalUserInRow ,' user');
        
        for(let userIndex = 1; userIndex <= totalUserInRow; userIndex++){
            // console.log('user คนที่ ', userIndex);
            let user = {}
            
            // get username 
            let statusSelectorCheck = await checkUserStatus(page,pageRowIndex,userIndex)
            let waiteStatusSL = await page.waitForSelector(statusSelectorCheck)
            let username = await page.evaluate(el => el.textContent , waiteStatusSL)
            user.username = username
            
            
            // get date
            let dateSL = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div`
            let waitDateSL = await page.waitForSelector(dateSL)
            let date = await page.evaluate(el => el.textContent , waitDateSL)
            user.date = date

            // get review 
            let reviewSL = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent`
            let waitReviewSL = await page.waitForSelector(reviewSL)
            let review = await page.evaluate(el => el.textContent , waitReviewSL)
            user.review = review

            // get avartar 
            let avartarSL = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > a > div.appHubIconHolder.${userStatus} > img`
            await page.waitForSelector(avartarSL)
            let avartar = await page.$eval(avartarSL, el => el.getAttribute('src'))
            user.avartar = avartar 

            // get vote review
            let voteSL = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`
            await page.waitForSelector(voteSL)
            let vote = await page.$eval(voteSL,el => el.getAttribute('src'));
            if(vote.includes('thumbsUp')){
                vote = 'positive'
            }else if(vote.includes('thumbsDown')){
                vote = 'negative'
            }else{
                vote = 'cant read value'
            }
            user.vote = vote

            users.push(user)

        }
            

    }

    await browser.close() // close 
    console.log(users);
    console.log('end');
}

scrap()

// *** row type
//  1. #page_?_row_?_template_twoSmall
//  2. #page_?_row_?_template_threeSmall
//  3. #page_?_row_?_template_smallFallbac 
//  4. #page_?_row_?_template_mediumFallback
//  5. #page_?_row_?_template_largeFallback
async function checkTemplate(page,pageRowIndex){
    templateCaseName = 'twoSmall'
    return await page.$$eval(`#page_1_row_${pageRowIndex}_template_twoSmall > div`, (el)=>{
        return el.filter(el => el.hasAttribute('data-panel')).length  // in user review must be attr data-panel 
    })
    // 2. threeSmall Case 
    .then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'threeSmall'
            return page.$$eval(`#page_1_row_${pageRowIndex}_template_threeSmall > div`, (el)=>{
                return el.filter(el => el.hasAttribute('data-panel')).length
            })
        }else{
            return result
        }
    // 3. smallFallback
    }).then((result)=>{
        if(result === 0 || result === undefined || result === null ){
            templateCaseName = 'smallFallback'
            return page.$$eval(`#page_1_row_${pageRowIndex}_template_smallFallback > div`, (el)=>{
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
            return page.$$eval(`#page_1_row_${pageRowIndex}_template_mediumFallback > div`, (el)=>{
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
            return page.$$eval(`#page_1_row_${pageRowIndex}_template_largeFallback > div`, (el)=>{
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
    let statusSelectorCheck = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.online.ellipsis > a:nth-child(2)`            

    // case 1 
    userStatus = 'online'
    await page.$$eval(statusSelectorCheck , el => el.length)
    // case 2 in-game
    .then((result)=>{
        if(result === 0){
            userStatus = 'in-game'
            statusSelectorCheck = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.in-game.ellipsis > a:nth-child(2)`
            return page.$$eval(statusSelectorCheck , el => el.length)
        }else{
            return result
        }
    })
    // case 3 offline
    .then((result)=>{
        if(result === 0){
            userStatus = 'offline'
            statusSelectorCheck = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.offline.ellipsis > a:nth-child(2)`
            return page.$$eval(statusSelectorCheck,el => el.length)
        }else{
            return result
        }
    })

    return statusSelectorCheck
}

async function voteSelector (page,pageRowIndex,userIndex){
    let voteSL = `#page_1_row_${pageRowIndex}_template_${templateCaseName} > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`
    await page.$$eval(voteSL , el => el.length).then((result)=>{
        if(result === 0){
            console.log( 'no url !!!!!!');
        }
    })

    return voteSL
}