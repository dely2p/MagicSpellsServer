module.exports = function(app, fs) {
  app.get("/", function(req, res) {
    res.render("index", {
      title: "Magic Spells",
      length: 5
    });
  });

  app.get("/list", function(req, res) {
    fs.readFile(__dirname + "/../data/spells.json", "utf8", function(err, data) {
      console.log(data);
      res.end(data);
    });
  });

  app.get("/getMagicData/:spell", function(req, res) {
    fs.readFile(__dirname + "/../data/spells.json", "utf8", function(err, data) {
      var magicSpells = JSON.parse(data);
      res.json(magicSpells[req.params.spell]);
    });
  });

  app.post("/addMagicData/:spell", function(req, res) {
    var result = {};
    var spell = req.params.spell;

    // CHECK REQ VALIDITY
    if (!req.body["effect"] || !req.body["source"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // LOAD DATA & CHECK DUPLICATION
    fs.readFile(__dirname + "/../data/spells.json", "utf8", function(err, data) {
      var magicSpells = JSON.parse(data);
      if (magicSpells[spell]) {
        // DUPLICATION FOUND
        result["success"] = 0;
        result["error"] = "duplicate";
        res.json(result);
        return;
      }

      // ADD TO DATA
      magicSpells[spell] = req.body;

      // SAVE DATA
      fs.writeFile(
        __dirname + "/../data/spells.json",
        JSON.stringify(magicSpells, null, "\t"),
        "utf8",
        function(err, data) {
          result = { success: 1 };
          res.json(result);
        }
      );
    });
  });

  app.put("/updateMagicData/:spell", function(req, res) {
    var result = {};
    var spell = req.params.spell;

    // CHECK REQ VALIDITY
    if (!req.body["effect"] || !req.body["source"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // LOAD DATA
    fs.readFile(__dirname + "/../data/spells.json", "utf8", function(err, data) {
      var magicSpells = JSON.parse(data);
      // ADD/MODIFY DATA
      magicSpells[spell] = req.body;

      // SAVE DATA
      fs.writeFile(
        __dirname + "/../data/spells.json",
        JSON.stringify(magicSpells, null, "\t"),
        "utf8",
        function(err, data) {
          result = { success: 1 };
          res.json(result);
        }
      );
    });
  });

  app.delete("/deleteUser/:spell", function(req, res) {
    var result = {};
    //LOAD DATA
    fs.readFile(__dirname + "/../data/spells.json", "utf8", function(err, data) {
      var magicSpells = JSON.parse(data);

      // IF NOT FOUND
      if (!magicSpells[req.params.spell]) {
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }

      // DELETE FROM DATA
      delete magicSpells[req.params.username];

      // SAVE FILE
      fs.writeFile(
        __dirname + "/../data/spells.json",
        JSON.stringify(magicSpells, null, "\t"),
        "utf8",
        function(err, data) {
          result["success"] = 1;
          res.json(result);
          return;
        }
      );
    });
  });
};
