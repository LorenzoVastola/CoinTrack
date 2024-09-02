async function saved(){
    let fetchdata = await fetch('/saved')
    let data_res = await fetchdata.json()

    let content_list = $('.content_list')
 
            
            data_res.Saved.forEach(element => { 
                console.log(element)
            })

            let x = await general()
            console.log(x)
            
        } 


saved()


async function general(){
    let fetchdata = await fetch('/saved-page')
    let data_res = await fetchdata.json()

   return data_res
}

