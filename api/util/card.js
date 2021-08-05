module.exports = {
  "id": "60fab63baef4eb24127db8bd",
  "checkItemStates": null,
  "closed": false,
  "dateLastActivity": "2021-08-04T16:31:16.101Z",
  "desc": "Allow the choice between multiple templates or versions of a page.\nChoose per brand and per restaurant\n\n---\n\n**TECH NOTES**\n\n- Add few properties in Yext so that FE can build the right page\n- Need to decide how to structure these new props\n- Refactor FE build process so that it is possible to associate more than one page to the same path. e.g. new menu template still results in the same url =>  `/order-at-table/restaurant/{id}/menus`  \n\n---\n\nWe need to agree on how granular is the control for the feature flags.\n\n- Each restaurant can choose the old/new pages - where we have a master feature flag which can override like splitBillEnabled which can be switched off (which means it can override each restaurant's feature flag)\n\n---\n\n** ACCEPTANCE CRITERIA**\n\n- all pages default to old (current version) of page\n- display at least one new version of page\n- Switch back to old version of page\n\n---\n** OTHER NOTES **\n- POC: https://github.com/Azzurri-Group/oat-front-end/tree/refactor/choose-new-pages",
  "descData": {
    "emoji": {}
  },
  "dueReminder": null,
  "idBoard": "5defb4e37446cb210eee43d0",
  "idList": "5e1edf19ff7f138a08a9ca6c",
  "idMembersVoted": [],
  "idShort": 1184,
  "idAttachmentCover": null,
  "idLabels": [
    "606f11fb3af8e4254804a090",
    "5f27ddb22b9f1b4eb5eaf348",
    "5ee7861161fe79315e823c39"
  ],
  "manualCoverAttachment": false,
  "name": "Choose different versions of the same page",
  "pos": 17348752.48968506,
  "shortLink": "sunXOEK7",
  "isTemplate": false,
  "cardRole": null,
  "badges": {
    "attachmentsByType": {
      "trello": {
        "board": 0,
        "card": 0
      }
    },
    "location": false,
    "votes": 0,
    "viewingMemberVoted": false,
    "subscribed": false,
    "fogbugz": "",
    "checkItems": 8,
    "checkItemsChecked": 1,
    "checkItemsEarliestDue": null,
    "comments": 2,
    "attachments": 1,
    "description": true,
    "due": null,
    "dueComplete": false,
    "start": null
  },
  "dueComplete": false,
  "due": null,
  "idChecklists": [
    "60fab63baef4eb24127db8c1"
  ],
  "idMembers": [
    "5d6f9af115d171898386ca4c",
    "59c3b3ae04ae6c2625c51824",
    "5a0187b4edf2ac6bc82df711"
  ],
  "labels": [
    {
      "id": "606f11fb3af8e4254804a090",
      "idBoard": "5defb4e37446cb210eee43d0",
      "name": "New order journey",
      "color": "lime"
    },
    {
      "id": "5f27ddb22b9f1b4eb5eaf348",
      "idBoard": "5defb4e37446cb210eee43d0",
      "name": "Front End",
      "color": "yellow"
    },
    {
      "id": "5ee7861161fe79315e823c39",
      "idBoard": "5defb4e37446cb210eee43d0",
      "name": "Backend",
      "color": "sky"
    }
  ],
  "shortUrl": "https://trello.com/c/sunXOEK7",
  "start": null,
  "subscribed": false,
  "url": "https://trello.com/c/sunXOEK7/1184-choose-different-versions-of-the-same-page",
  "cover": {
    "idAttachment": null,
    "color": null,
    "idUploadedBackground": null,
    "size": "normal",
    "brightness": "dark",
    "idPlugin": null
  },
  "pluginData": [
    {
      "id": "61012bb876088250088d2326",
      "idPlugin": "5d04ed246be0d68368cb10d1",
      "scope": "card",
      "idModel": "60fab63baef4eb24127db8bd",
      "value": "{\"prioritize\":\"3\",\"type\":\"task\",\"estimate\":\"13\"}",
      "access": "shared",
      "dateLastUpdated": "2021-08-02T12:56:43.153Z"
    }
  ]
}
