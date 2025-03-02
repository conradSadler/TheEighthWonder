const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const hbs = handlebars.create({extname: 'hbs', layoutsDir: __dirname + '../frontend/public/layout', partialsDir: __dirname + '../frontend/public/partial',});
app.engine('hbs',hbs.engine);
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
// set Session
app.use(
  session({
    saveUninitialized: true,
    resave: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const user = {
    finalAmount: undefined,
};
/*
Might NEED:

app.get('/login', (req, res) => {
  res.render('pages/login');
});

*/

app.post('/calculate'), (req, res) => {
    try
    {
        const initialAmount = req.body.initialAmount;
        const theAPY = req.body.apy;
        const years = req.body.time;

        let parsedInitialAmount = "";
        let parsedInitialAPY = "";
        let parsedInitialYears = "";

        let inDecimal = false;

        for(let i = 0; i < initialAmount.lenth; i++)
        {
            if(initialAmount.charAt(i) == '.' || (initialAmount.charAt(i) >= '0' && initialAmount.charAt(i) <= '9'))
            {
                parsedInitialAmount+=initialAmount.charAt(i);
            }
        }
        for(let i = 0; i < theAPY.lenth; i++)
        {
            if(i == 0 && theAPY.charAt(i) == '.')
            {
                parsedInitialAPY+=theAPY.charAt(i);
                inDecimal = true;
            }
            else if(theAPY.charAt(i) >= '0' && theAPY.charAt(i) <= '9')
            {
                parsedInitialAPY+=theAPY.charAt(i);
            }
        }

        for(let i = 0; i < years.lenth; i++)
        {
            if(years.charAt(i) == '.' || (years.charAt(i) >= '0' && years.charAt(i) <= '9'))
            {
                parsedInitialYears+=years.charAt(i);
            }
        }

        const initialAmountFloat = parseFloat(parsedInitialAmount);
        const yearsFloat = parseFloat(parsedInitialYears);

        let initialAPYFloat = 0;
        if(inDecimal == true)
        {
            initialAPYFloat = parseFloat(parsedInitialAPY);
        }
        else
        {
            initialAPYFloat = parseFloat(parsedInitialAPY)/100;
        }
        const finalAmountFloat = initialAmountFloat * Math.pow( (1+(initialAPYFloat/1)) , (1*yearsFloat) );
        user.finalAmount = finalAmountFloat;
        req.session.user = user;
        req.session.save();

        res.redirect('/result');
    }
    catch (err)
    {
        res.status(400).json({error:err,});
    }
}