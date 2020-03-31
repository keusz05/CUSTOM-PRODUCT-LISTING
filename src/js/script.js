let element = $('.element');
let data = {
    config:{
        spreadsheet: "https://docs.google.com/spreadsheets/d/1MiT-buxIAtuaqW2WAn53sq5hJ4K-dNH-vtMFmoKfcsA/edit?usp=sharing",
    }
};
let rawSpreadSheet = data.config.spreadsheet;
let sSheet = rawSpreadSheet.substr(rawSpreadSheet.indexOf("d/") + 2).replace('/edit?usp=sharing','');
pagination(document,"script","paginationJS","https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js",function(){
    $.ajax({
        url:"https://spreadsheets.google.com/feeds/list/"+sSheet+"/1/public/values?alt=json"
    }).then(function(gsxVal){
        let gsx = gsxVal.feed.entry;
        let refined = gsx.map(i=>{
            return {
                productname:i.gsx$productname.$t,
                productnumber:i.gsx$productnumber.$t,
                productimage:i.gsx$productimage.$t,
                productlabels:i.gsx$productlabels.$t,
                productinfo:i.gsx$productinfo.$t,
                productpdf:i.gsx$productpdf.$t,
                maincategory:i.gsx$maincategory.$t,
                subcategory:i.gsx$subcategory.$t,
                innercategory:i.gsx$innercategory.$t
            }
        });
        createPagination(refined);
    });
});

function createPagination(dataSource){
    $(element).find('.mainContainer').pagination({
        dataSource:dataSource,
        pageSize:3,
        callback: function(resp, pagination) {
            let createProducts = resp.length != 0 ? createHTML(resp):`No Result`;
            $(element).find('.innerContainer').html(createProducts);
        }
    });
}

function createHTML(prod){//Create HTML Here
    let output = ``;
    prod.map(i=>{
        output += `
            <div class="itemContainer">
                <div class="itemName">${i.productnumber}</div>
            </div>
        `;
    });
    return output;
}

// PLUGINS
const paginateCss = 'paginationCss';
if (!document.getElementById(paginateCss)){
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = 'paginationCss';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.1.4/pagination.css';
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
}

function pagination(d,s,id,url,callback){
    $('#'+id).remove();
    var fjs = d.getElementsByTagName(s)[0];
    if(d.getElementById(id)){return}
    script = d.createElement(s);
    script.id = id;
    script.src = url;
    fjs.parentNode.insertBefore(script,fjs);
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    fjs.parentNode.insertBefore(script,fjs);
}