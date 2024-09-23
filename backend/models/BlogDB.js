import  mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    Title: String,
    Desc: String
},{collection:'myblog'})

export const BlogDB = mongoose.model('Blog',blogSchema);