module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `pictures` ORDER BY pic_id ASC"; //  

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to Annelise's Professional Photo Blog | View {Pics}"
                ,pics: result
            });
        });
    },
};