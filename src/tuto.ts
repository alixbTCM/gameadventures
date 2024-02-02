import { discussion, hiddenZone, notifications, digicode, cameraMovingMode, inventory, arrayFilling, actionForAllPlayers, sounds, switchingTiles } from './modules'
import {ActionMessage} from "@workadventure/iframe-api-typings";
import * as utils from "./utils";

WA.onInit().then(async () => {
  let displayActionMessage: ActionMessage | null = null

  // INVENTORY
  //    Initialisation
  inventory.initiateInventory(4)

  const inventoryItems: Record<string, { id: string, name:string, image: string, description: string }> = {
    'bread': {
      'id'         : 'inventoryBreadItem',
      'name'       : 'Bread',
      'image'      : '',
      'description': 'This is the bread you took in your inventory ! It has no image, so the default one must appear'
    },
    'croissant': {
      'id'         : 'inventoryCroissantItem',
      'name'       : 'Croissant',
      'image'      : 'croissant.png',
      'description': 'This is the croissant you took in your inventory !'
    },
    'pancake': {
      'id'         : 'inventoryPancakeItem',
      'name'       : 'Pancake',
      'image'      : '',
      'description': 'This is the pancake you took in your inventory ! It has no image, so the default one must appear'
    }
  }

  for (let key in inventoryItems) {
    WA.room.onEnterLayer(`inventory/${key}Zone`).subscribe(() => {
      if (!inventory.hasItem(inventoryItems[key].id)) {
        displayActionMessage = WA.ui.displayActionMessage({
          message: `[SPACE] Add ${key} to inventory`,
          callback: () => {
            inventory.addToInventory({
              id: inventoryItems[key].id,
              name: inventoryItems[key].name,
              image: inventoryItems[key].image,
              description: inventoryItems[key].description
            })

            utils.layers.toggleLayersVisibility(`inventory/${key}Zone`, false)
          }
        })
      }
    })

    WA.room.onLeaveLayer(`inventory/${key}Zone`).subscribe(() => {
      displayActionMessage?.remove()
      displayActionMessage = null
    })
  }

  // DISCUSSION
  WA.room.onEnterLayer('discussion/discussionZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] Talk',
      callback: () => {
        discussion.openDiscussionWebsite(
          'Ann Onymous',
          'Hello ! You are currently talking to a NPC !',
          'Close'
        )
      }
    })
  })

  WA.room.onLeaveLayer('discussion/discussionZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  // NOTIFICATIONS
  const notificationType: Record<string, string> = {
    'error': 'notifications/errorNotificationZone',
    'success': 'notifications/successNotificationZone',
    'info': 'notifications/infoNotificationZone'
  }

  for (let type in notificationType) {
    WA.room.onEnterLayer(notificationType[type]).subscribe(() => {
      displayActionMessage = WA.ui.displayActionMessage({
        message: `[SPACE] NOTIFY ${type.toUpperCase()}`,
        callback: () => {
          notifications.notify(
            'Content of the notification',
            type.toUpperCase(),
            type
          )
        }
      })
     })

    WA.room.onLeaveLayer(notificationType[type]).subscribe(() => {
      displayActionMessage?.remove()
      displayActionMessage = null
    })
  }

  // SOUNDS
  sounds.initiateSounds()

  WA.room.onEnterLayer('sounds/soundZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] Play sound for me',
      callback: () => {
        sounds.playSound('successSound');
      }
    })
  })

  WA.room.onLeaveLayer('sounds/soundZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  // SWITCHING TILES
  switchingTiles.setSwitchingTile(
    'switchingTiles',
    () => {
      notifications.notify('Congratulations ! You resolved the puzzle')
    }
  )

  // CAMERA MOVING
  cameraMovingMode.initializeCameraMovingMode()

  WA.room.onEnterLayer('cameraMoving/zone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] Move camera',
      callback: () => {
        cameraMovingMode.setCameraPositionToPlayerPosition()
        cameraMovingMode.openCameraMovingWebsite()
      }
    })
  });

  WA.room.onLeaveLayer('cameraMoving/zone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  // DIGICODE
  //   initialisation
  digicode.createDigicode('myDigicode', [{
    code: '123',
    callback: () => {
      digicode.closeDigicode()
      notifications.notify(
        'Success',
        'You entered the right code',
        'success'
      )
    }}])
  digicode.initiateDigicodes('myDigicode')

  //   Open digicode
  WA.room.onEnterLayer('digicode/digicodeZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] Open digicode',
      callback: () => {
        digicode.openDigicode('myDigicode')
      }
    })
  });

  WA.room.onLeaveLayer('digicode/digicodeZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  // HIDDEN ZONE
  hiddenZone.initiateHiddenZones([{stepIn: 'hiddenZone/zone', hide: 'hiddenZone/top'}])

  // ACTION FOR ALL PLAYERS
  //   Notify action
  actionForAllPlayers.initializeActionForAllPlayers('notificationAction', (variable: string|null) => {
    if (!!variable) {
      notifications.notify(`${variable} sends a notification to all players`);
    }
  })

  //   Chat action
  actionForAllPlayers.initializeActionForAllPlayers('chatAction', (variable: string|null) => {
    if (!!variable) {
      // @ts-ignore
      WA.chat.sendChatMessage(`${variable} is saying "Hello !" to everyone on the map`, {scope: 'local', author: 'Voice over'});
    }
  })

  //   Animation action
  actionForAllPlayers.initializeActionForAllPlayers('animationAction', (variable: true|null) => {
    if (!!variable) {
      utils.layers.triggerAnimationWithLayers([
        'actionForAllPlayers/animation/animation1',
        'actionForAllPlayers/animation/animation2',
        'actionForAllPlayers/animation/animation1',
        'actionForAllPlayers/animation/animation2',
        'actionForAllPlayers/animation/animation1',
        'actionForAllPlayers/animation/animation2'
      ], 150)
    }
  })

  WA.room.onEnterLayer('actionForAllPlayers/notificationZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] send notification to everyone',
      callback: () => {
        actionForAllPlayers.activateActionForAllPlayer('notificationAction', WA.player.name)
        setTimeout(() => {
          actionForAllPlayers.activateActionForAllPlayer('notificationAction', null, true)
        }, 200)
      }
    })
  })

  WA.room.onLeaveLayer('actionForAllPlayers/notificationZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })


  WA.room.onEnterLayer('actionForAllPlayers/chatZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] send notification to everyone',
      callback: () => {
        actionForAllPlayers.activateActionForAllPlayer('chatAction', WA.player.name)
        setTimeout(() => {
          actionForAllPlayers.activateActionForAllPlayer('chatAction', null, true)
        }, 200)
      }
    })
  })

  WA.room.onLeaveLayer('actionForAllPlayers/chatZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  WA.room.onEnterLayer('actionForAllPlayers/soundZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] play sound for everyone',
      callback: () => {
        sounds.playSoundForAll('successSound')
      }
    })
  })

  WA.room.onLeaveLayer('actionForAllPlayers/soundZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  WA.room.onEnterLayer('actionForAllPlayers/animationZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[SPACE] play animation for everyone on the map',
      callback: () => {
        actionForAllPlayers.activateActionForAllPlayer('animationAction')
        setTimeout(() => {
          actionForAllPlayers.activateActionForAllPlayer('animationAction', null, true)
        }, 200)
      }
    })
  })

  WA.room.onLeaveLayer('actionForAllPlayers/animationZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })

  // ARRAY FILLING
  arrayFilling.setArrayFilling(
    'numberArrayToFill',
    [
      ['3', '5', '7', '8', '6', '2', '5', '5', '9', '0', '7', '9', '6', '7', '8', '5', '3'],
      ['1', '3', '4', '7', '8', '6', '9', '6', '9', '7', '8', '5', '4', '5', '9', '6', '3'],
      ['3', '4', '5', '8', '6', '7', '3', '7', '7', '5', '5', '6', '3', '9', '3', '5', '6'],
    ],
    () => {
      // Notify user
      notifications.notify('WRONG !', 'ERROR', 'error')

      // Teleport player to begining of array filling
      // @ts-ignore
      WA.player.teleport(832, 736);
    },
    () => {
      // Notify user
      notifications.notify('Congratulations!', 'SUCCESS', 'success')

      // Set finished
      utils.layers.toggleLayersVisibility('arrayFilling/finished')
      WA.player.state.hasFinishedArrayFilling = true
    }
  )

  for(let i = 1; i < 10; i++) {
    WA.room.onEnterLayer(`arrayFilling/numbers/${i}`).subscribe(() => {
      arrayFilling.testArrayFilling('numberArrayToFill', i.toString())
    })
  }

  WA.room.onEnterLayer('arrayFilling/infoZone').subscribe(() => {
    displayActionMessage = WA.ui.displayActionMessage({
      message: '[space] Read infos',
      callback: () => {
        discussion.openDiscussionWebsite(
          'Infos',
          'If you manage to follow one of these paths all the way to the end, then you\'ll be able to go through : 35786255907967853 // 13478696978545963 // 34586737755639356',
          'Close'
        )
      }
    })
  })

  WA.room.onLeaveLayer('arrayFilling/infoZone').subscribe(() => {
    displayActionMessage?.remove()
    displayActionMessage = null
  })
});