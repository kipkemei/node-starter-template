const fs = require('fs');
// const pdf = require('html-pdf');
var pdf = require("pdf-creator-node");
import * as init from "../../init";

export default function (data: any) {
    const html = fs.readFileSync('src/routes/digitalLease/pdf-template.html', 'utf8');
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        "footer": {
            "height": "10mm",
            "contents": {
                default: '<div style="color: #39393a; text-align: right; font-size: 10px;"><span>Page {{page}}</span> of <span>{{pages}}</span></div>', // fallback value
            }
        }
    };
    // let filename = `/static/${new Date().getTime()}.pdf`;
    let filename = `/static/foo.pdf`;
    let filePath = `./public${filename}`;
    // pdf.create(html, options).toFile(filePath, function(err: any, res: any) {
    //     if (err) return;
    // });

    var users = [
        {
            name:"Shyam",
            age:"26"
        },
        {
            name:"Navjot",
            age:"26"
        },
        {
            name:"Vitthal",
            age:"26"
        }
    ];
    let date = new Date();
    var document = {
        html: html,
        data: {
            users: users,
            data: data,
            property: "Beren Complex",
            date: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
            landlord: "Benjamin Kebeney",
            tenant: "Kipkemei Isaac"
        },
        path: filePath
    };
    pdf.create(document, options)
        .then((res: any) => {
            console.log(res);
            return {success: "Foo", filename: filename}
        })
        .catch((error: any) => {
            console.error(error);
            return {"error": "Faolled", filename: ""}
        });
    return {"filename": filename};

}
