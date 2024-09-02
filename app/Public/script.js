     
    async function GetData(){
        try {
            let data = await fetch('/dashboard')
            let data_res = await data.json()
    

            let content_list = $('.content_list')

          
            
            data_res.forEach(element => { 
                /* Creating functions to reduce length of data, just 
                to print easier on screen, we use function
                so we dont write a lot of time the same stuff*/

                const formatPrice = (price) => `$${price.toFixed(2)}`;
                const formatVolumeOrCap = (num) => {
                    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`; 
                    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`; 
                    return `$${num.toFixed(2)}`; 
                };
                const formatPercent = (percent) => `${percent.toFixed(2)}%`;

            
               /* Append (print) all data */
               
               let elementCont = $(`<div class="element"></div>`)
               let data = $(`<div class="nameDiv"></div>`)
                
               let savemark = $(`<i class="fa-regular fa-bookmark save"></i>`)
               data.append(savemark);
                savemark.on('click',function (event){
                    saveClick(event,element)
                })
               data.append(`<div  class="wrapName"><p>${element.name}</p></div>`)
               data.append(`<p class="symbol">${element.symbol}</p>`)
               data.append(`<img src="${element.imageUrl}">`)
               elementCont.append(data)

               elementCont.append(`<div class="data"><p> ${formatPrice(element.price)}</p></div>`);

               if(element.c24< 0) elementCont.append(`<div class="data redData"><p>${formatPercent(element.c24)}</p></div>`);
               if(element.c24>= 0) elementCont.append(`<div class="data greenData"><p>${formatPercent(element.c24)}</p></div>`);
               if(element.c7d< 0) elementCont.append(`<div class="data redData"><p>${formatPercent(element.c7d)}</p></div>`);
               if(element.c7d>= 0) elementCont.append(`<div class="data greenData"><p>${formatPercent(element.c7d)}</p></div>`);
               if(element.c1< 0) elementCont.append(`<div class="data redData"><p>${formatPercent(element.c1)}</p></div>`);
               if(element.c1>= 0) elementCont.append(`<div class="data greenData"><p>${formatPercent(element.c1)}</p></div>`);
        
                elementCont.append(`<div class="data normalData"><p>${formatVolumeOrCap(element.markcap)}</p></div>`);
                elementCont.append(`<div class="data normalData"><p>${formatVolumeOrCap(element.v24)}</p></div>`);

                content_list.append(elementCont)

            });





        } catch (error) {
            console.log(error)
        }
        
    }
    
    GetData()

    let j = 0;
    function saveClick(event,element){
        
        let x = $(event.target)
        x.toggleClass("fa-regular fa-solid")

        console.log(element.name)

        fetch('/saved-element',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({Name:element.name})
        })
        .then((res)=>console.log('Success',res))
        .catch((err)=>console.log('Error',error))
        
    }
