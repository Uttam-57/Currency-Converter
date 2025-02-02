async function getExchangeRate(fromCurrency, toCurrency) {
    const date = "latest"; // or specific date in YYYY-MM-DD format
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${fromCurrency}.json`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data['date'])
       
        // Extract exchange rate
        const rate = data[fromCurrency]?.[toCurrency];
        console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}:`, rate);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

// Example usage
//getExchangeRate("eur", "inr"); // Exchange rate from INR to EUR

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".exchange");
const fromcurr = document.querySelector(".from select")
const tocurr = document.querySelector(".to select")
const msg = document.querySelector(".msg")
const reversebtn = document.querySelector(".icon button")


for (let select of dropdown) {
    for (currCode in countryList) {
        let newoption = document.createElement("option")
        newoption.text = currCode;
        newoption.value = currCode;
        select.append(newoption)
        if (select.name == "from" && currCode == "USD") {
            newoption.selected = "selected"
        } 
        else if(select.name == "to" && currCode == "INR"){
            newoption.selected = "selected"
        }
    }
    
    select.addEventListener("change",(evt)=>{
       updateFlage(evt.target);
    })
}

if (reversebtn) {
    reversebtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        console.log("Reverse button clicked!"); 
        
        // Swap currency values
        const fromcurr = document.querySelector(".from select");
        const tocurr = document.querySelector(".to select");
        const fromflag =document.querySelector(".from img");
        const toflag =document.querySelector(".to img");
        let tempValue = fromcurr.value;
        fromcurr.value = tocurr.value;
        tocurr.value = tempValue;
        let flagfrom=countryList[fromcurr.value]
        let flagto=countryList[tocurr.value]
        console.log(flagfrom,flagto)
        let fromSrc =`https://flagsapi.com/${flagfrom}/flat/64.png`
        let toSrc =`https://flagsapi.com/${flagto}/flat/64.png`
        fromflag.src=fromSrc
        toflag.src=toSrc
        console.log(`Swapped: ${fromcurr.value} ↔ ${tocurr.value}`);
    });
} else {
    console.error("Reverse button not found!");
}

const updateFlage = (element) =>{
     let currencycode=element.value
     let countrycode = countryList[currencycode]
     let newSrc =`https://flagsapi.com/${countrycode}/flat/64.png`
     let img = element.parentElement.querySelector("img")
     img.src = newSrc
}

   

btn.addEventListener ("click" , async (evt) =>{
    evt.preventDefault();
    let amount = document.querySelector(".amount input")
    let amtValue = amount.value
    if(amtValue == "" || amtValue <1){
        amtValue = 1
        amount.value="1"
    }
    console.log(amtValue)
    let fromvalue =fromcurr.value.toLowerCase()
    let tovalue =tocurr.value.toLowerCase()
    console.log(fromvalue,tovalue)
    let rate= await getExchangeRate(fromvalue,tovalue);
    console.log(rate)
    let finalamount= amtValue*rate
    console.log(finalamount)
    msg.innerText =`${amtValue} ${fromcurr.value} = ${finalamount} ${tocurr.value}`

})