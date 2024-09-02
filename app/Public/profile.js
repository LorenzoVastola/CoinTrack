$('document').ready(()=>{
    $('#pass').on('mouseover', function() {
        $(this).attr('type', 'text')
    }).on('mouseout', function() {
        $(this).attr('type', 'password')
    });
})
async function printData(){
    const response = await fetch('/myprofile')
    const prop = await response.json()
    

    let name = $('#name')
    let email = $('#email')
    let pass = $('#pass')

    name.append(prop.Username)
    email.append(prop.Email)
    pass.val(prop.Password)
}

printData()