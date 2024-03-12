exports.printing = async (req, res) => {
    console.log("Print");
    return res.status(200).send("Printed Successfully");
}