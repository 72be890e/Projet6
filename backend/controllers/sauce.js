module.exports.getSauce = (req,res) => {
    console.log(req.auth)
    return res.status(200).json([1,2,3,4,5])
}