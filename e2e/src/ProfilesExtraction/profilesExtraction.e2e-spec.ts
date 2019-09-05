import { AppPage } from '../PageObjects/app.po';
import { TestRailsClient } from '../TestRails/TestRailsClient';
import { DBUtils } from '../Utils/dbUtils';
import { by, browser, Key } from 'protractor';
import { link } from 'fs';
import { async } from '@angular/core/testing';

let page: AppPage;
let TestRail: TestRailsClient;
let sqlCmd: DBUtils;

describe('When the User is logged into UltraApp and it needs to log into LinkedIn', () =>{
    beforeEach(() =>{
        page = new AppPage();
        page.navigateTo();
        page.performSignIn('cynan.clucas@globant.com', 'Testing123!');        
    });
    it('Should allow the user to open a new tab to login', async () => {
        var addTabButton = await page.getAddTabButton();
        addTabButton.click();
        addTabButton.click();
        addTabButton.click();

        var extractionButton = await page.getStartExtractionButton();
        extractionButton.sendKeys(Key.TAB + 'cynan.clucas@globant.com');
        //var shadowRootContent = await page.FindShadowDomElement();
        //shadowRootContent.sendKeys('nate.thompson@globant.com');
        //var linkedInEmailTextBox = page.getLinkedInEmailTextBox();
        //expect(linkedInEmailTextBox).toBeDefined();
        //linkedInEmailTextBox.sendKeys('cynan.clucas@globant.com');
        page.performSignOut();
    });


});