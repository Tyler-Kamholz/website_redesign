const { redirect } = require('express/lib/response');
const { Pool } = require('pg');


const pool = new Pool({
    user: 'tydog320',
    host: 'db.bit.io',
    database: 'tydog320/webproject', // public database 
    password: 'v2_3vst4_YNdVqneKxp4iuUZaRf4U8nF', // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
});

pool.connect;


function getDrivers(req, res) {

    pool.query('SELECT * FROM "drivers" ORDER BY "points" DESC', (error, driver_results) => {

        if (error) {
            console.log(error);
        }
        else {

            pool.query('SELECT * FROM "teams" ORDER BY "points" DESC', (error, team_results) => {

                if (error) {

                    console.log(error);

                }
                else {

                    res.render('pages/standings', { driver_results: driver_results.rows, team_results: team_results.rows, session: req.session });

                }

            })

        }

    });

}

//only admin power
function addDrivers(req, res) {

    let uploadedFile = req.files.driver_photo
    let databaseFile = `../assets/Drivers/${uploadedFile.name}`
    let uploadedPath = `${__dirname}/public/assets/Drivers/${uploadedFile.name}`;

    uploadedFile.mv(uploadedPath);
    

    pool.query('INSERT INTO "drivers" (first_name, last_name, race_num, team, points, driver_image) VALUES ($1, $2, $3, $4, $5, $6)', [req.body.first_name, req.body.last_name, req.body.race_num, req.body.team, req.body.points, databaseFile], (error, results) => {

        if (error) {
            console.log(error);
        }
        else {
            res.redirect('add_driver')
        }

    });

}

function driverRender(req, res) {

    pool.query('SELECT * FROM "teams" ORDER BY "team"', (error, team_results) => {

        if (error) {

            console.log(error);

        }
        else {

            res.render('pages/add_driver', { teams: team_results.rows, session: req.session });

        }

    });

}

//only admin power
function removeDrivers(req, res) {

    pool.query('DELETE FROM "drivers" WHERE first_name = $1',[req.body.first_name], (error, results) => {

        if (error) {
            console.log(error);
        }
        else {
            res.redirect('remove_driver');
        }

    });

}

function deleteDriverRender(req, res) {

    pool.query('SELECT * FROM "drivers" ORDER BY "first_name"', (error, driver_results) => {

        if (error) {
            console.log(error);
        }
        else {

            res.render('pages/remove_driver', {driver: driver_results.rows, session: req.session})

        }

    });

}

//only admin power
function updateDrivers(req, res) {

    pool.query('UPDATE "drivers" SET points = $2 WHERE first_name = $1',[req.body.first_name, req.body.driver_points], (error, results) => {

            if (error) {
                console.log(error);
            }
            else {
                res.redirect('update_driver')
            }

        });

}

function updateDriverRender(req, res) {

    pool.query('SELECT * FROM "drivers" ORDER BY "first_name"', (error, driver_results) => {

        if (error) {
            console.log(error);
        }
        else {

            res.render('pages/update_driver', {driver: driver_results.rows, session: req.session})

        }

    });

}


function getRace(req, res) {

    pool.query('SELECT * FROM "race" ORDER BY "race_number"', (error, results) => {

        if (error) {

            console.log(error);

        }
        else {

            res.render('pages/next_race', { data: results.rows, session: req.session });
        }

    });

}

//only admin power
function addRace(req, res) {

    let uploadedFile = req.files.track_image
    let databaseFile = `../assets/tracks/${uploadedFile.name}`
    let uploadedPath = `${__dirname}/public/tracks/Drivers/${uploadedFile.name}`;

    uploadedFile.mv(uploadedPath);
    

    pool.query('INSERT INTO "race" (race_number, race_month_start, race_month_end, race_date_start, race_date_end, track_location, race_name, track_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [req.body.race_number, req.body.race_month_start, req.body.race_month_end, req.body.race_date_start, req.body.race_date_end, req.body.track_location, req.body.race_name, databaseFile], (error, results) => {

        if (error) {
            console.log(error);
        }
        else {
            res.redirect('add_race')
        }

    });

}

//only admin power
function deleteRace(req, res) {

    pool.query('DELETE FROM "race" WHERE race_name = $1', [req.body.remove_race], (error, results) => {

        if (error) {
            console.log(error);
        }
        else {
            res.redirect('remove_race')
        }

    });

}

function deleteRaceRender(req ,res) {

    pool.query('SELECT * FROM "race" ORDER BY "race_number"', (error, results) => {

        if (error) {

            console.log(error);

        }
        else {

            res.render('pages/remove_race', { races: results.rows, session: req.session });
        }

    });

}



function getTeams(req, res) {

    pool.query('SELECT * FROM "teams" ORDER BY "points" DESC', (error, team_results) => {

        if (error) {

            console.log(error);

        }
        else {

            res.render('pages/team_info', { team_results: team_results.rows, session: req.session });

        }

    });

}


function addUser(req, res) {

    pool.query('INSERT INTO "users" (username, password) VALUES ($1, $2) returning *', [req.body.username, req.body.password], (error, results) => {

        if (error) {
            console.log(error);
        }
        else {
            res.redirect('login');
        }

    });

}

//add
function deleteUser(req, res) {

    pool.query('DELETE FROM "users" WHERE username = $1', [req.session.username], (error, results) => {

        if (error) {
            console.log(error)
        }
        else {
            req.session.loggedIn = false;
            res.redirect('home')
        }

    })

}

function userLogin(req, res) {

    if(req.session.loggedIn) {

        pool.query('SELECT * from "users" WHERE username = $1 AND password = $2', [req.session.username, req.session.password], (error, user_results) => {

            if (error) {
                console.log(error);
            }
            else {
    
                pool.query('SELECT * from "teams"', (error, team_results) => {
    
                    if (error) {
                        console.log(error);
                    }
                    else {
    
                        pool.query('SELECT * from "race"', (error, race_results) => {
    
                            if (error) {
                                console.log(error);
                            }
                            else {
    
                                res.render('pages/personalized', { user_results: user_results.rows, teams: team_results.rows, race: race_results.rows, session: req.session });
    
                            }
    
                        })
    
                    }
    
                })
    
            }
    
        })

    } else{

        pool.query('SELECT * from "users" WHERE username = $1 AND password = $2', [req.body.username, req.body.password], (error, user_results) => {

            if (error) {
                console.log(error);
            }
            else {
    
                pool.query('SELECT * from "teams"', (error, team_results) => {
    
                    if (error) {
                        console.log(error);
                    }
                    else {
    
                        pool.query('SELECT * from "race"', (error, race_results) => {
    
                            if (error) {
                                console.log(error);
                            }
                            else {
    
                                if (user_results.rowCount == 1 && user_results.rows[0].password === req.body.password) {
    
                                    if(req.body.username == 'tydog320') {
    
                                        req.session.admin = true;
    
                                    } else {
    
                                        req.session.admin = false;
                                        
                                    }
    
                                    req.session.loggedIn = true;
                                    req.session.username = req.body.username;
                                    req.session.password = req.body.password;
                                    req.session.name = user_results.rows[0].name;
    
                                    
                                    res.render('pages/personalized', { user_results: user_results.rows, teams: team_results.rows, race: race_results.rows, session: req.session });
                                }
                                else {
                                    res.redirect('login');
                                }
    
                            }
    
                        })
    
                    }
    
                })
    
            }
    
        })

    }

}

function updateUser(req, res) {

    pool.query('UPDATE "users" SET favorite_driver = $1, favorite_team = $2, favorite_track = $3, name = $4 WHERE username = $5', [req.body.favorite_driver, req.body.favorite_team, req.body.favorite_track, req.body.name, req.session.username], (error, newuser_results) => {

        if (error) {
            console.log(error);
        }
        else {

            pool.query('SELECT * from "users" WHERE username = $1 AND password = $2', [req.session.username, req.session.password], (error, user_results) => {

                if (error) {
                    console.log(error);
                }
                else {
        
                    pool.query('SELECT * from "teams"', (error, team_results) => {
        
                        if (error) {
                            console.log(error);
                        }
                        else {
        
                            pool.query('SELECT * from "race"', (error, race_results) => {
        
                                if (error) {
                                    console.log(error);
                                }
                                else {
        
                                    if (user_results.rowCount == 1 && user_results.rows[0].password == req.session.password) {
        
                                        res.render('pages/personalized', { user_results: user_results.rows, teams: team_results.rows, race: race_results.rows, session: req.session });
                                    }
                                    else {
                                        res.redirect('login');
                                    }
        
                                }
        
                            })
        
                        }
        
                    })
        
                }
        
            })

        }

    })
}

function updateUserInfo(req, res) {

    pool.query('SELECT * from "teams"', (error, team_results) => {

        if (error) {
            console.log(error);
        }
        else {

            pool.query('SELECT * from "race"', (error, race_results) => {

                if (error) {
                    console.log(error);
                }
                else {

                    res.render('pages/edit_profile', { teams: team_results.rows, races: race_results.rows, session: req.session  })

                }

            }

            )

        }

    })

}



exports.addUser = addUser;
exports.userLogin = userLogin;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.updateUserInfo = updateUserInfo;

exports.getDrivers = getDrivers;
exports.addDrivers = addDrivers;
exports.removeDrivers = removeDrivers;
exports.updateDrivers = updateDrivers;

exports.driverRender = driverRender;
exports.deleteDriverRender = deleteDriverRender;
exports.updateDriverRender = updateDriverRender;

exports.getRace = getRace;
exports.addRace = addRace;
exports.deleteRace = deleteRace;
exports.deleteRaceRender = deleteRaceRender;

exports.getTeams = getTeams;
