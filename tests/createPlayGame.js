import {By,Key,Builder} from "selenium-webdriver";
import chromedriver from "chromedriver";

async function createPlayGame(){

    /*
    *   PART 1
    *   Login and schedule a doubles game
    */
 
    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();
 
    //To fetch the Attic Ping Pong site from the browser with our code.
    await driver.get("https://atticpingpong.com/");
    await driver.sleep(1000);
            
    //To send a search query by passing the value in searchString.
    // await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);

    //Click Login
    await driver.findElement(By.linkText("Login")).click();
    await driver.sleep(1000);

    //Verify the page title and print it
    // var title = await driver.getTitle();
    // console.log('Title is:',title);
 


    //fill in email
    await driver.findElement(By.xpath("//input[@type='text']")).sendKeys("tquinlan@unomaha.edu");
    //fill in password
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys("Attic383");
    await driver.sleep(1000);

    //Click Log In
    await driver.findElement(By.xpath("//*[contains(text(), 'Log In')]")).click();
    await driver.sleep(1000);

    //Click Create a Game tab
    await driver.findElement(By.linkText("Create a Game")).click();
    await driver.sleep(1000);

    //Select and add players to middle column
    // await driver.findElement(By.xpath("//input")).click();
    // await driver.findElement(By.xpath("//ul[@tabindex=1]")).click();
    // await driver.findElement(By.xpath("//ul[@id='vs1__listbox']")).click();
    await driver.findElement(By.xpath("//input")).sendKeys("colin");
    await driver.findElement(By.xpath("//input")).sendKeys(Key.ENTER);
    await driver.findElement(By.xpath("//input")).sendKeys("kelvin");
    await driver.findElement(By.xpath("//input")).sendKeys(Key.ENTER);
    await driver.findElement(By.xpath("//input")).sendKeys("alex");
    await driver.findElement(By.xpath("//input")).sendKeys(Key.ENTER);
    await driver.findElement(By.xpath("//input")).sendKeys("terrah");
    await driver.findElement(By.xpath("//input")).sendKeys(Key.ENTER);

    //Move two teams to Team One and two to Team Two with arrow svgs
    await driver.findElement(By.xpath("(//*[name()='svg'][@data-icon='left-long'])[1]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//*[name()='svg'][@data-icon='right-long'])[2]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//*[name()='svg'][@data-icon='left-long'])[2]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//*[name()='svg'][@data-icon='right-long'])[3]")).click();
    await driver.sleep(1000);

    //Click Schedule Game
    await driver.findElement(By.xpath("//*[contains(text(), 'Schedule Game')]")).click();
    //Success soak in time
    await driver.sleep(2500);
    
    /*
    *   PART 2
    *   NOW navigate and start a (the first) game from the game detail page instead of this page
    *   just for fun
    */

    //Click Create a Game tab
    await driver.findElement(By.linkText("Games")).click();
    await driver.sleep(1000);

    //Click drop down and select Scheduled Games to be Played
    await driver.findElement(By.xpath("//*[contains(text(), 'Game Options')]")).click();
    await driver.findElement(By.xpath("//*[contains(text(), 'Scheduled Games to be Played')]")).click();
    await driver.sleep(1000);

    //Click on Game to navigate to detail page and click Start Game
    await driver.findElement(By.xpath("(//div[@class='flex flex-col border shadow-md rounded-xl bg-neutral-100 md:px-2 lg:px-5 sm:py-1 hover:shadow-gray-400'])[1]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.linkText("START GAME")).click();
    await driver.sleep(1000);

    /*
    *   PART 3
    *   Play the game (lopsided so it's over quickly)
    */
    await driver.findElement(By.xpath("(//*[contains(text(), 'Start Game')])[2]")).click();
    await driver.sleep(1000);
    for(var i = 0; i < 21; i++) {
        await driver.findElement(By.xpath("(//div[@class='team-container relative flex flex-col items-center justify-around w-full select-none bg-site-color-one text-site-color-two'])[1]")).click();
    }
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//*[contains(text(), 'Next Set')])[2]")).click();
    await driver.sleep(1000);
    for(var i = 0; i < 21; i++) {
        await driver.findElement(By.xpath("(//div[@class='team-container relative flex flex-col items-center justify-around w-full select-none bg-site-color-one text-site-color-two'])[1]")).click();
    }
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//*[contains(text(), 'End Game')])[2]")).click();
    await driver.sleep(2500);
    

    //It is always a safe practice to quit the browser after execution
    await driver.quit(30);
}

createPlayGame();
