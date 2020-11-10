function openStream() {
    gamestream = new WebSocket('ws://' + host + '/gamestream')
    gamestream.onopen = () => {
      // now we are connected
      console.log('connected gamestream')
      gamestream.send(JSON.stringify({type: 'ready', id: myid})) //send a ready
      gamestream.onmessage = (message) => {
        let data = JSON.parse(message.data)
        switch(data.type) {
          case 'start':
            console.log("we can start", myid)
            startGame()
          break
          case 'update':
            update(data)
          break
        }
      }
    }
  }

  function update(data) {
    cells = []
    //console.log(data.gamedata.cells)
    /*
                  id: cell.id, 
                  pos: cell.pos,
                  owner: cell.owner,
                  type: cell.element.type,
                  parent: (cell.parent) ? cell.parent.id : -1
    */
    for (let cell of data.gamedata.cells) {
      //console.log(cell.name)
      cells.push(new Cell(cell.owner, cell.name, cell.id, cell.pos, cell.type, cell.parent))
    }
    //here the world is created: 
    
    events = []
    for (let event of data.gamedata.events) {
      events.push(event)
    }
  }