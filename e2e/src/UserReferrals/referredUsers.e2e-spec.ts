import { AppPage } from '../PageObjects/app.po';
import { DBUtils } from '../Utils/dbUtils';
import { by } from 'protractor';

let page: any;
let sqlCmd: DBUtils;
let referredUsers = [
    {"email": 'ashish.paranjape@globant.com', "signUpDate" : '7 de agosto de 2018', 'progress': '100%', 'xpath': 'td[contains(@id,\'isActive\')]//i[contains(@class, \'large green checkmark icon\')]'},
    {"email": 'martin.migoya@globant.com', "signUpDate" : '2 de agosto de 2018', 'progress': '54%', 'xpath': 'td[contains(@id,\'isActive\')]//i[contains(@class, \'large yellow info icon\')]'},
    {"email": 'luis.saenz@globant.com', "signUpDate" : '3 de diciembre de 2018', 'progress': '5%', 'xpath': 'td[contains(@id,\'isActive\')]//i[contains(@class, \'large yellow info icon\')]'},
];


describe('When the user is logged into ultraApp and it has no referrals ', () =>{
    beforeEach( async () =>{
        page = new AppPage();
        sqlCmd = new DBUtils();
        page.navigateTo();
        page.performSignIn('cynan.clucas@globant.com', 'Testing123!');    
        await sqlCmd.removeReferrals(['luis.saenz@globant.com', 'martin.migoya@globant.com','ashish.paranjape@globant.com', 'federico.pienovi@globant.com', 'nate.thompson@globant.com']);
    });
    it('should display referrals page header properly ', () => {
        var referralsButton = page.getReferralsButton();
        expect(referralsButton).toBeDefined('Referrals button was not present in UltraApp');        
        referralsButton.click();
        expect(page.getReferralHeader().getText()).toEqual('Referidos');
        expect(page.getReferredHeaderEmail()).toEqual('E-mail');
        expect(page.getReferredHeaderSignup()).toEqual('Fecha de alta');
        expect(page.getReferredHeaderProgress()).toEqual('Progreso actual');
        expect(page.getReferredHeaderIsActive()).toEqual('Activo');
        var okButton = page.getOkButton();
        expect(okButton).toBeDefined('OK Button was not present in UltraApp');
        var referralsTable = page.getReferralsTable();
        expect(referralsTable.all(by.tagName('tr')).count()).toBe(1);
        okButton.click();
        page.performSignOut();
    });
});


describe('When the user is logged into Ultra app and it has referrals', () => {
    beforeEach(async () =>{
        page = new AppPage();
        sqlCmd = new DBUtils();
        page.navigateTo();
        page.performSignIn('cynan.clucas@globant.com', 'Testing123!');    
        await sqlCmd.addReferrals('cynan.clucas@globant.com',['luis.saenz@globant.com', 'martin.migoya@globant.com','ashish.paranjape@globant.com']);
        await sqlCmd.editReferals('ashish.paranjape@globant.com', '2018-08-07 12:43:39', '4000');
        await sqlCmd.editReferals('martin.migoya@globant.com', '2018-08-02 18:23:04', '2153');
        await sqlCmd.editReferals('luis.saenz@globant.com', '2018-12-03 11:57:44', '193');
    });

    it('should display referrals page header properly', () =>{
        var referralsButton = page.getReferralsButton();
        expect(referralsButton).toBeDefined('Referrals button was not present in UltraApp');        
        referralsButton.click();
        expect(page.getReferralHeader().getText()).toEqual('Referidos');
        expect(page.getReferredHeaderEmail()).toEqual('E-mail');
        expect(page.getReferredHeaderSignup()).toEqual('Fecha de alta');
        expect(page.getReferredHeaderProgress()).toEqual('Progreso actual');
        expect(page.getReferredHeaderIsActive()).toEqual('Activo');
        var okButton = page.getOkButton();
        expect(okButton).toBeDefined('OK Button was not present in UltraApp');
        var referralsTable = page.getReferralsTable();
        var tableBody = referralsTable.all(by.tagName('tbody'));
        expect(tableBody.all(by.tagName('tr')).count()).toEqual(3);
        var tableRows = tableBody.all(by.tagName('tr'));
        for (var x =0; x < 3; x++){
            var referredUser = tableRows.get(x);
            expect(referredUser.element(by.id('email')).getText()).toEqual(referredUsers[x].email);              
            expect(referredUser.element(by.id('signupDate')).getText()).toEqual(referredUsers[x].signUpDate);
            expect(referredUser.element(by.xpath('td[contains(@id,\'progressPerc\')]//div[contains(@class, \'bar\')]//div[contains(@class,\'progress\')]')).getText()).toEqual(referredUsers[x].progress);
            expect(referredUser.element(by.xpath(referredUsers[x].xpath))).toBeDefined();
        }
        page.getOkButton().click();
        page.performSignOut();
    });
});
