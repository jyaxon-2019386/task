import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    impactLevel: {
        type: String,
        required: true
    },
    yearsCareer: {
        type: String,
        required: true
    },
    categoryBusiness: {
        type: String,
        required: true
    },
}, {
    versionKey: false
}
);

export default mongoose.model('company', companySchema)
