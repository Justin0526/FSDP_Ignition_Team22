import * as customerModel from "../models/customer_model.js";

export async function getAllCustomers(req, res){
    try{
        const customers = await customerModel.getAllCustomers();
        res.status(200).json(customers);
    }catch(error){
        console.error("Controller error: ", error);
        res.status(500).json({error: "Error retireving all customers"});
    }
}