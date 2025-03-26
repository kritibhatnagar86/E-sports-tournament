// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const sql = require('../init/db');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// // create function
// const create = async (req, res) => {
//     // console.log(req.body);
//     const { name, gameID, date,ownerUsername } = req.body;
//     const today = new Date();
//     today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); 
//     const formattedToday = today.toISOString().split("T")[0]; 

//     // console.log("Today's Date (Local Adjusted):", formattedToday);
//     // console.log("Provided Date (Raw):", date);

//     const inputDate = new Date(date);
//     inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset()); 
//     const formattedInputDate = inputDate.toISOString().split("T")[0];

//     // console.log("Formatted Input Date:", formattedInputDate);

//     const status = formattedInputDate > formattedToday ? "Upcoming" : "Ongoing";
//       const check = await pool.query('SELECT GameID FROM Tournaments WHERE GameID = $1', [gameID]);
//       if (check.rows.length > 0) {  // Fixing condition
//           return res.status(400).json({ error: 'This game ID is already present. Use a different one.' });
//       }
      
//     try {
//         const result = await pool.query(
//             'INSERT INTO Tournaments (Name, GameID, Date, Status, OwnerUsername) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [name, gameID, date, status, ownerUsername]
//         ); 
//         res.status(201).json({ message: 'Tournament created successfully!', tournament: result.rows[0] });
//     } catch (error) {
//         console.error('Error creating tournament:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// const show = async (req, res) => {
//   try {
//       const { search, searchBy } = req.query; // Get search query and filter type

//       let query = "SELECT * FROM Tournaments";
//       let queryParams = [];

//       if (search && searchBy) {
//           switch (searchBy.toLowerCase()) {
//               case "name":
//                   query += " WHERE LOWER(Name) LIKE $1";
//                   break;
//               case "gameid":
//                   query += " WHERE GameID::TEXT LIKE $1";
//                   break;
//               case "status":
//                   query += " WHERE LOWER(Status) LIKE $1";
//                   break;
//               default:
//                   return res.status(400).json({ error: "Invalid search filter" });
//           }
//           queryParams.push(`%${search.toLowerCase()}%`);
//       }

//       query += " ORDER BY Date ASC"; // Maintain sorting order

//       const result = await pool.query(query, queryParams);

//       const formattedResults = result.rows.map(row => {
//           const dateObj = new Date(row.date);
//           dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
//           return {
//               ...row,
//               date: dateObj.toISOString().split("T")[0] // Ensure correct date format
//           };
//       });

//     //   console.log("Formatted Output:", formattedResults);
//       res.json(formattedResults);
//   } catch (error) {
//       console.error("Error fetching tournaments:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// };


   

//     // ✅ Fetch a tournament by ID (Used in /:id and /edit/:id routes)
//     const getTournamentById = async (req, res) => {
//       const { id } = req.params;
      
//       try {
//         const result = await pool.query("SELECT * FROM Tournaments WHERE ID = $1", [id]);
//         const formattedResults = result.rows.map(row => {
//             const dateObj = new Date(row.date);
//             dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
//             return {
//                 ...row,
//                 date: dateObj.toISOString().split("T")[0] // Ensure correct date format
//             };
//         });
//         if (result.rows.length === 0) {
//           return res.status(404).json({ error: "Tournament not found" });
//         }
    
//         res.json(formattedResults[0]);
//       } catch (error) {
//         console.error("Error fetching tournament:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     };
    
//     // ✅ Update tournament details
//     const updateTournament = async (req, res) => {
//       const { name, gameID, date,ownerUsername } = req.body;
//       console.log(ownerUsername);
//       const { id } = req.params;
//        // Ensure only the owner can update
//        const today = new Date();
//        today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); 
//        const formattedToday = today.toISOString().split("T")[0]; 
//       try {
//         const result = await pool.query(
//           "UPDATE Tournaments SET Name=$1, GameID=$2, Date=$3 WHERE ID=$4 AND OwnerUsername=$5 RETURNING *",
//           [name, gameID, date,  id, ownerUsername]
//         );
      
//         const result1 = await pool.query("SELECT * FROM Tournaments WHERE ID = $1", [id]);
//         const formattedResults = result1.rows.map(row => {
//             const dateObj = new Date(row.date);
//             dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
//             return {
//                 ...row,
//                 date: dateObj.toISOString().split("T")[0] // Ensure correct date format
//             };
//         });
//         const date1 = formattedResults[0].date;
//         console.log(date1,formattedToday);
//         const status = date1 > formattedToday ? "Upcoming" : "Ongoing";
//         const result3 = await pool.query(
//             "UPDATE Tournaments SET Status=$1 where ID=$2 RETURNING *",
//             [status,id]
//           );
         
//         // console.log(result);
    
//         if (result.rowCount === 0 || result3.rowCount===0) {
//           return res.status(403).json({ error: "Unauthorized or tournament not found" });
//         }
    
//         res.json({ message: "Tournament updated successfully!", tournament: result.rows[0] });
//       } catch (error) {
//         console.error("Error updating tournament:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     };

//    const deleteTournament =async (req, res) => {
//     const { id } = req.params;
    

//     try {
//         const result = await pool.query(
//             'DELETE FROM Tournaments WHERE ID=$1  RETURNING *',
//             [id]
//         );

//         if (result.rowCount === 0) {
//             return res.status(403).json({ error: 'Unauthorized or tournament not found' });
//         }

//         res.json({ message: 'Tournament deleted successfully!' });
//     } catch (error) {
//         console.error('Error deleting tournament:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
    

// const scedulematches = async (req, res) => {
//   const { id: tournamentId } = req.params;

//   try {
//       // Step 1: Check if the tournament exists and is 'Upcoming'
//       const tournamentRes = await pool.query("SELECT status FROM Tournaments WHERE id = $1", [tournamentId]);

//       if (tournamentRes.rows.length === 0) {
//           return res.status(404).json({ error: "Tournament not found." });
//       }

//       if (tournamentRes.rows[0].status !== "Upcoming") {
//           return res.status(400).json({ error: "Matches already scheduled for this tournament." });
//       }

//       // Step 2: Fetch all players already scheduled in matches for this tournament
//       const existingMatches = await pool.query(
//           "SELECT player1username, player2username FROM matches WHERE tournamentid = $1",
//           [tournamentId]
//       );

//       let usedPlayers = new Set(); // Track matched players
//       existingMatches.rows.forEach(match => {
//           usedPlayers.add(match.player1username);
//           usedPlayers.add(match.player2username);
//       });

//       // Step 3: Fetch all teams and their players
//       const teamRes = await pool.query("SELECT teamcode, username FROM teams WHERE tournamentid = $1", [tournamentId]);

//       let teamDict = {}; // Dictionary to store teams and their players

//       teamRes.rows.forEach(row => {
//           if (!teamDict[row.teamcode]) {
//               teamDict[row.teamcode] = [];
//           }
//           teamDict[row.teamcode].push(row.username);
//       });

//       let teamCodes = Object.keys(teamDict);

//       if (teamCodes.length < 2) {
//           return res.status(400).json({ error: "Not enough teams to create matches." });
//       }

//       let matches = [];

//       while (true) {
//           let availableTeams = teamCodes.filter(tc => teamDict[tc].some(p => !usedPlayers.has(p)));

//           if (availableTeams.length < 2) break; // Stop if we can't form a match

//           let team1 = availableTeams[0];
//           let team2 = availableTeams[1];

//           let player1 = teamDict[team1].find(p => !usedPlayers.has(p));
//           let player2 = teamDict[team2].find(p => !usedPlayers.has(p));

//           if (player1 && player2) {
//               matches.push({
//                   tournament_id: tournamentId,
//                   player1username: player1,
//                   player2username: player2,
//                   winning_team_code: null
//               });

//               usedPlayers.add(player1);
//               usedPlayers.add(player2);
//           }
//       }

//       if (matches.length === 0) {
//           return res.status(400).json({ error: "No new matches could be scheduled." });
//       }

//       // Step 4: Insert scheduled matches into the database
//       const matchInsertQueries = matches.map(match =>
//           pool.query(
//               "INSERT INTO matches (tournamentid, player1username, player2username, winnerusername) VALUES ($1, $2, $3, $4) RETURNING *",
//               [match.tournament_id, match.player1username, match.player2username, match.winning_team_code]
//           )
//       );
//       await Promise.all(matchInsertQueries);

//       res.status(200).json({ message: "Matches scheduled successfully ✅", matches });

//   } catch (err) {
//       console.error("Error scheduling matches:", err);
//       res.status(500).json({ error: "Failed to schedule matches" });
//   }
// };
// const showmatches=async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM matches WHERE tournamentid = $1", [req.params.id]);
//     // if (result.rows.length === 0) {
//     //   return res.status(404).json({ message: "No matches found for this tournament" });
//     // }
//     // console.log(result.rows);
//     res.json({ matches: result.rows });
//   } catch (err) {
//     console.error("Failed to load matches:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// const showteams= async (req, res) => {
//   const tournamentId = req.params.id;

//   try {
//     // Fetch all players with their respective scores, player usernames, and teamcode based on tournament_id
//     const query = `
//       SELECT
//         teamcode,
//         username,
//         score
//       FROM
//         teams
//       WHERE
//         tournamentid = $1
//       ORDER BY
//         teamcode;
//     `;

//     const result = await pool.query(query, [tournamentId]);

//     // Group players by teamcode and calculate total score for each team
//     const groupedTeams = {};

//     result.rows.forEach((row) => {
//       if (!groupedTeams[row.teamcode]) {
//         groupedTeams[row.teamcode] = {
//           teamcode: row.teamcode,
//           total_score: 0,
//           players: [],
//         };
//       }

//       // Add the player with their individual score to the team
//       groupedTeams[row.teamcode].players.push({
//         playerusername: row.username,
//         score: row.score,
//       });

//       // Add the player's score to the total score of the team
//       groupedTeams[row.teamcode].total_score += row.score;
//     });

//     // Convert the object into an array and sort teams by teamcode (ascending)
//     const sortedTeams = Object.values(groupedTeams).sort((a, b) => b.total_score - a.total_score); // Sort by total score descending
    
    
//     res.json({ teams: sortedTeams });
//   } catch (err) {
//     console.error('Error fetching tournament teams:', err);
//     res.status(500).json({ error: 'Failed to load tournament teams' });
//   }
// };
// // Logout Function
// const logout = (req, res) => {
//     res.json({ message: "Logged out successfully" });
// };

// module.exports = { create, logout, show, updateTournament, getTournamentById,deleteTournament,scedulematches,showmatches,showteams };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../init/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// create function
const create = async (req, res) => {
    const { name, gameID, date, ownerUsername } = req.body;
    //const today = new Date();
    //     today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); 
    //     const formattedToday = today.toISOString().split("T")[0]; 
    
    //     // console.log("Today's Date (Local Adjusted):", formattedToday);
    //     // console.log("Provided Date (Raw):", date);
    
    //     const inputDate = new Date(date);
    //     inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset()); 
    //     const formattedInputDate = inputDate.toISOString().split("T")[0];
    
    //     // console.log("Formatted Input Date:", formattedInputDate);
    
    //     const status = formattedInputDate > formattedToday ? "Upcoming" : "Ongoing";
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); 
    const formattedToday = today.toISOString().split("T")[0];
    const inputDate = new Date(date);
    inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset()); 
    const formattedInputDate = inputDate.toISOString().split("T")[0];
    const status = formattedInputDate > formattedToday ? "Upcoming" : "Ongoing";

    const check = await sql`SELECT GameID FROM Tournaments WHERE GameID = ${gameID}`;
    if (check.length > 0) {
        return res.status(400).json({ error: 'This game ID is already present. Use a different one.' });
    }
    
    try {
        const result = await sql`
            INSERT INTO Tournaments (Name, GameID, Date, Status, OwnerUsername)
            VALUES (${name}, ${gameID}, ${date}, ${status}, ${ownerUsername})
            RETURNING *
        `;
        res.status(201).json({ message: 'Tournament created successfully!', tournament: result[0] });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const show = async (req, res) => {
  try {
      const { search, searchBy } = req.query; // Get search query and filter type
      let result;

      if (search && searchBy) {
          switch (searchBy.toLowerCase()) {
              case "name":
                  result = await sql`
                      SELECT * FROM Tournaments 
                      WHERE LOWER(Name) LIKE ${'%' + search.toLowerCase() + '%'} 
                      ORDER BY Date ASC
                  `;
                  break;
              case "gameid":
                  result = await sql`
                      SELECT * FROM Tournaments 
                      WHERE GameID::TEXT LIKE ${'%' + search + '%'} 
                      ORDER BY Date ASC
                  `;
                  break;
              case "status":
                  result = await sql`
                      SELECT * FROM Tournaments 
                      WHERE LOWER(Status) LIKE ${'%' + search.toLowerCase() + '%'} 
                      ORDER BY Date ASC
                  `;
                  break;
              default:
                  return res.status(400).json({ error: "Invalid search filter" });
          }
      } else {
          result = await sql`
              SELECT * FROM Tournaments ORDER BY Date ASC
          `;
      }

      const formattedResults = result.map(row => {
          const dateObj = new Date(row.date);
          dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
          return {
              ...row,
              date: dateObj.toISOString().split("T")[0] // Ensure correct date format
          };
      });

      res.json(formattedResults);
  } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

//     // ✅ Fetch a tournament by ID (Used in /:id and /edit/:id routes)
//     const getTournamentById = async (req, res) => {
//       const { id } = req.params;
      
//       try {
//         const result = await pool.query("SELECT * FROM Tournaments WHERE ID = $1", [id]);
//         const formattedResults = result.rows.map(row => {
//             const dateObj = new Date(row.date);
//             dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
//             return {
//                 ...row,
//                 date: dateObj.toISOString().split("T")[0] // Ensure correct date format
//             };
//         });
//         if (result.rows.length === 0) {
//           return res.status(404).json({ error: "Tournament not found" });
//         }
    
//         res.json(formattedResults[0]);
//       } catch (error) {
//         console.error("Error fetching tournament:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     };
    
const getTournamentById = async (req, res) => {
  const { id } = req.params;

  try {
      const result = await sql`
          SELECT * FROM Tournaments WHERE ID = ${id}
      `;

      if (result.length === 0) {
          return res.status(404).json({ error: "Tournament not found" });
      }

      const formattedResult = result.map(row => {
          const dateObj = new Date(row.date);
          dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
          return {
              ...row,
              date: dateObj.toISOString().split("T")[0] // Ensure correct date format
          };
      });

      res.json(formattedResult[0]);
  } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTournament = async (req, res) => {
  const { name, gameID, date, ownerUsername } = req.body;
  console.log(ownerUsername);
  const { id } = req.params;
  
  // Ensure only the owner can update
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const formattedToday = today.toISOString().split("T")[0];

  try {
      const result = await sql`
          UPDATE Tournaments 
          SET Name = ${name}, GameID = ${gameID}, Date = ${date} 
          WHERE ID = ${id} AND OwnerUsername = ${ownerUsername} 
          RETURNING *
      `;

      const result1 = await sql`
          SELECT * FROM Tournaments WHERE ID = ${id}
      `;

      const formattedResults = result1.map(row => {
          const dateObj = new Date(row.date);
          dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset()); // Adjust timezone
          return {
              ...row,
              date: dateObj.toISOString().split("T")[0] // Ensure correct date format
          };
      });

      const date1 = formattedResults[0].date;
      console.log(date1, formattedToday);
      const status = date1 > formattedToday ? "Upcoming" : "Ongoing";

      const result3 = await sql`
          UPDATE Tournaments 
          SET Status = ${status} 
          WHERE ID = ${id} 
          RETURNING *
      `;

      if (result.length === 0 || result3.length === 0) {
          return res.status(403).json({ error: "Unauthorized or tournament not found" });
      }

      res.json({ message: "Tournament updated successfully!", tournament: result[0] });
  } catch (error) {
      console.error("Error updating tournament:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTournament = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`DELETE FROM Tournaments WHERE ID=${id} RETURNING *`;
        if (result.length === 0) {
            return res.status(403).json({ error: "Unauthorized or tournament not found" });
        }
        res.json({ message: "Tournament deleted successfully!" });
    } catch (error) {
        console.error("Error deleting tournament:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const scheduleMatches = async (req, res) => {
  const { id: tournamentId } = req.params;

  try {
    // Check if tournament exists and is 'Upcoming'
    const tournamentRes = await sql`
      SELECT status FROM Tournaments WHERE id = ${tournamentId}
    `;

    if (tournamentRes.length === 0) {
      return res.status(404).json({ error: "Tournament not found." });
    }

    if (tournamentRes[0].status !== "Upcoming") {
      return res.status(400).json({ error: "Matches already scheduled for this tournament." });
    }

    // Fetch already scheduled players
    const existingMatches = await sql`
      SELECT player1username, player2username FROM matches WHERE tournamentid = ${tournamentId}
    `;

    let usedPlayers = new Set();
    existingMatches.forEach(match => {
      usedPlayers.add(match.player1username);
      usedPlayers.add(match.player2username);
    });

    // Fetch teams and players
    const teamRes = await sql`
      SELECT teamcode, username FROM teams WHERE tournamentid = ${tournamentId}
    `;

    let teamDict = {};
    teamRes.forEach(row => {
      if (!teamDict[row.teamcode]) teamDict[row.teamcode] = [];
      teamDict[row.teamcode].push(row.username);
    });

    let teamCodes = Object.keys(teamDict);
    if (teamCodes.length < 2) {
      return res.status(400).json({ error: "Not enough teams to create matches." });
    }

    let matches = [];

    while (true) {
      let availableTeams = teamCodes.filter(tc => teamDict[tc].some(p => !usedPlayers.has(p)));
      if (availableTeams.length < 2) break;

      let team1 = availableTeams[0];
      let team2 = availableTeams[1];

      let player1 = teamDict[team1].find(p => !usedPlayers.has(p));
      let player2 = teamDict[team2].find(p => !usedPlayers.has(p));

      if (player1 && player2) {
        matches.push({
          tournament_id: tournamentId,
          player1username: player1,
          player2username: player2,
          winning_team_code: null
        });

        usedPlayers.add(player1);
        usedPlayers.add(player2);
      }
    }

    if (matches.length === 0) {
      return res.status(400).json({ error: "No new matches could be scheduled." });
    }

    // Insert scheduled matches into the database
    await Promise.all(
      matches.map(match =>
        sql`
          INSERT INTO matches (tournamentid, player1username, player2username, winnerusername) 
          VALUES (${match.tournament_id}, ${match.player1username}, ${match.player2username}, ${match.winning_team_code})
          RETURNING *;
        `
      )
    );

    res.status(200).json({ message: "Matches scheduled successfully ✅", matches });
  } catch (err) {
    console.error("Error scheduling matches:", err);
    res.status(500).json({ error: "Failed to schedule matches" });
  }
};

const showMatches = async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM matches WHERE tournamentid = ${req.params.id}
    `;
    res.json({ matches: result });
  } catch (err) {
    console.error("Failed to load matches:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const showTeams = async (req, res) => {
  const tournamentId = req.params.id;

  try {
    const result = await sql`
      SELECT teamcode, username, score
      FROM teams
      WHERE tournamentid = ${tournamentId}
      ORDER BY teamcode;
    `;

    let groupedTeams = {};

    result.forEach(row => {
      if (!groupedTeams[row.teamcode]) {
        groupedTeams[row.teamcode] = {
          teamcode: row.teamcode,
          total_score: 0,
          players: [],
        };
      }

      groupedTeams[row.teamcode].players.push({
        playerusername: row.username,
        score: row.score,
      });

      groupedTeams[row.teamcode].total_score += row.score;
    });

    const sortedTeams = Object.values(groupedTeams).sort((a, b) => b.total_score - a.total_score);

    res.json({ teams: sortedTeams });
  } catch (err) {
    console.error("Error fetching tournament teams:", err);
    res.status(500).json({ error: "Failed to load tournament teams" });
  }
};

const logout = (req, res) => {
    res.json({ message: "Logged out successfully" });
};

module.exports = { create, logout, show, updateTournament, getTournamentById, deleteTournament ,scheduleMatches,showMatches,showTeams};