
let itemToBeFormated = document.getElementById("principle");  //This finds the number that the user enterded as initial investment
/**
 * This event listener listens for when a key is released when the user is typing in initial investment 
 * text box. This input is parsed as an integer in base 10 useing a REGEX \D to get only digits. Then this integer is formated with toLocaleString(), which 
 * adds commas at significant places like 1,000.
 */ 
itemToBeFormated.addEventListener('keyup', function(evt){
    var parsedPrinciple = parseInt(this.value.replace(/\D/g,''),10);
    itemToBeFormated.value = parsedPrinciple.toLocaleString();
}, false);

/**
 * This function generates the values that will be displayed in the chart beased off of the compound intrest equation which is compounded once per year
 * @param {*} value the equation
 * @param {*} xStart the starting year
 * @param {*} xEnd the ending year
 * @param {*} step the interval of years. default 1
 * @param {*} xValues the empty array which will store the years
 * @param {*} yValues the empty array which will store the appreciated investment
 */
const generateData = (value,xStart,xEnd,step = 1,xValues,yValues) =>
{
    for(let x = xStart; x <= xEnd; x += step)
    {
        yValues.push(Number((eval(value)).toFixed(2)));  //calculating appreciated investment with equation, rounded to two decimal points
        xValues.push(x);
    }
}
/**
 * This function parses the user input from the page and then generates a chart(chart.js) using the user provided information.
 */
const calculate = () => {
    try
    {
        const initialAmount = document.getElementById("principle").value;
        const theAPY = document.getElementById("apy").value;
        const years = document.getElementById("time").value;

        let parsedInitialAmount = "";
        let parsedInitialAPY = "";
        let parsedInitialYears = "";

        let inDecimal = false;

        for(let i = 0; i < initialAmount.length; i++)
        {
            if(initialAmount.charAt(i) == '.' || (initialAmount.charAt(i) >= '0' && initialAmount.charAt(i) <= '9'))
            {
                parsedInitialAmount+=initialAmount.charAt(i);
            }
        }

        for(let i = 0; i < theAPY.length; i++)
        {
            if((i == 0 && theAPY.charAt(i) == '.') || (theAPY.charAt(i-1) == '0' && theAPY.charAt(i) == '.'))
            {
                parsedInitialAPY+=theAPY.charAt(i);
                inDecimal = true;
            }
            else if(theAPY.charAt(i) >= '0' && theAPY.charAt(i) <= '9')
            {
                parsedInitialAPY+=theAPY.charAt(i);
            }
        }

        for(let i = 0; i < years.length; i++)
        {
            if(years.charAt(i) == '.' || (years.charAt(i) >= '0' && years.charAt(i) <= '9'))
            {
                parsedInitialYears+=years.charAt(i);
            }
        }

        const initialAmountFloat = parseFloat(parsedInitialAmount);
        const yearsFloat = parseFloat(parsedInitialYears);

        let APYFloat = 0;
        if(inDecimal == true)
        {
            APYFloat = parseFloat(parsedInitialAPY);
        }
        else
        {
            APYFloat = parseFloat(parsedInitialAPY)/100;
        }
        //This conditional below removes any previous chart that was created becasue of previous times the user clicked "calculate"
        let chartOrig = document.getElementById("compoundIntrestChart");
        if(chartOrig)
        {
            chartOrig.remove();
        }

        let chart = document.createElement("canvas");  //creating canvas element where the chart will reside
        chart.id = "compoundIntrestChart";
        chart.style = "max-width: 100%;height:auto;";
        chart.classList = "rounded shadow";
        document.getElementById("chartLoc").appendChild(chart);
        let xValues = [];
        let yValues = [];
        generateData( (initialAmountFloat+" * "+(1+(APYFloat/1))+"** x") , 0, yearsFloat, 1,xValues,yValues);

        new Chart("compoundIntrestChart", {
            type: "line",
            data: {
              labels: xValues,
              datasets: [{
                fill: false,
                pointRadius: 3,
                borderColor: "#007BFF",
                data: yValues
              }]
            },    
            options: {
              legend: {display: false},
              scales: {
                yAxes: [{
                    scaleLabel:{ display: true, labelString: "US Dollars ($)"}
                }],
                xAxes:[{
                    scaleLabel:{ display: true, labelString: "Years"}
                }]
              },
              title: {
                display: true,
                text: "Total Investment",
              }
            }
          });
    }
    catch (err)
    {
        console.log("Error: " + err)
    }
}