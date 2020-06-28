// @ts-ignore
import express from "express";
import Agreement from "./Agreement";
// @ts-ignore
const router = express.Router();
import {db} from "../../init"

const leaseAgreementCollection = "lease-agreement";

interface Agreement {
        title: string;
        body: Array<string>
}
interface LeaseAgreement {
        body: Array<Agreement>;
        landlordSign: string,
        tenantSign?: string,
        pdfPath?: string
}

router.post("/agreement/", async (req, res) => {
        let ag = Agreement((req.body));
        let data = req.body;
        try {
                const a: Agreement = {
                        title: "FOO",
                        body: ["hello", "world"]
                };
                const leaseAgreement: LeaseAgreement = {
                        landlordSign: data.sign,
                        tenantSign: "",
                        body: data.body,
                        pdfPath: ag.filename
                };
                console.log(leaseAgreement);
                const newDoc = await db.collection(leaseAgreementCollection).add(leaseAgreement);
                res.status(201).send(`Created a new lease agreement: ${newDoc.id}`);
        } catch (error) {
                res.status(400).send(`User should contain firstName, lastName, email, areaNumber, department, id and contactNumber!!!`)
        }
        return res.json({"a": ag, "ff": "ddj"});
});

module.exports = router;
