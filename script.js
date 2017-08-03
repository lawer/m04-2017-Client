// Code goes here

function doTransform(xml, xsl) {
    // code for IE
    if (window.ActiveXObject) {
        ex = xml.transformNode(xsl);
        return ex;
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        return resultDocument;
    }

}

function renderXSLT(xmlUrl, xslUrl) {
    const promises = [
        $.get({
            url: xmlUrl,
            dataType: 'xml',
        }),
        $.get({
            url: xslUrl,
            dataType: 'xml',
        }),
    ];

    return Promise.all(promises).then(function (values) {
        $("#comics").html(doTransform(values[0], values[1]));
    });
}


$(document).ready(function () {
    var urlBase = "https://comicvine.gamespot.com/api/";
    var apiKey = "f2bd1fad4091fce08c06ebf912fedf5c3dbd760c";
    var resource = "characters";
    var url = `${urlBase}${resource}/?api_key=${apiKey}`;

    var cors_proxy = "https://crossorigin.me/";
    var urlCors = `${cors_proxy}${url}`;
    var urlLocal = "comics.xml";
    var urlXsl = "comics.xslt";

    renderXSLT(urlLocal, urlXsl)
        .then(function () {
            $('img').jqthumb({
                width: '100%',
                height: '300px',
                position: {
                    x: '50%',
                    y: '0%'
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});