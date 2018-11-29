/**
 * TODO generated, please specify type and doc for the params
 * @param payload
 *
 * @properties={typeid:24,uuid:"2B5D68E3-1B99-4E57-836E-72D91E6159B6"}
 */
function ws_create(payload){
	
	var args = String(payload);
	args = args.replace(/\[{/g,'')
	args = args.replace(/\},/g,',');
	args = args.replace(/\{/g,'');
	args = args.replace(/\}]/g,'');
	var a = args.split(',');
	
	for(var index = 0;index<a.length;index = index+3){
		var sp = a[index].split('=');
		if(sp[1] == 'command'){
			var command = a[index+1].split('=');
			
		}
		if(sp[1] == 'user_name'){
			var userName = a[index+1].split('=');
			
		}
		if(sp[1] == 'response_url'){
			var response_url = a[index+1].split('=');
			
		}
		if(sp[1] == 'text'){
			var text = a[index+1].split('=');
		}
		
	}
	var ans = executeCommands(command[1],userName[1],text[1])
//	
//	var http = plugins.http.createNewHttpClient();
//	var res = http.createPostRequest(response_url.toString());
//	res.setBodyContent('ans','text/plain');
//	var a = res.executeRequest();
//	application.output(a);
//	var aa = {
//    "attachments": [
//        {
//            "fallback": "New ticket from Andrea Lee - Ticket #1943: Can't reset my password - https://groove.hq/path/to/ticket/1943",
//            "pretext": "New ticket from Andrea Lee",
//            "title": "Ticket #1943: Can't reset my password",
//            "title_link": "https://groove.hq/path/to/ticket/1943",
//            "text": "Help! I tried to reset my password but nothing happened!",
//            "color": "good"
//        }
//    ]
//}	
	return ans;
//	var a = plugins.http.createNewHttpClient();
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {String} command
 * @param {String} userName
 * @param {String} text
 *
 * @properties={typeid:24,uuid:"0CEF9C16-CB3D-47B9-B666-553E578641CF"}
 */
function executeCommands(command,userName,text) {
	if(command == '/connect'){
		return connect(userName,text);
	} else if(command == '/whois'){
		return whois();
	} else if(command == '/disconnect'){
		return disconnect(userName,text)
	} else if(command == '/info'){
		return help();
	} else if(command == '/clear'){
		return clear(userName);
	}
}

/**
 * connect
 * @param {String} userName
 * @param {String} company
 *
 * @properties={typeid:24,uuid:"EC2BCA31-5A04-4D5A-83F6-9A9C616644A2"}
 * @AllowToRunInFind
 */
function connect(userName, company) {
	var returnText = '';
	
	if(foundset.find()){
		foundset.user_name = userName;
		var user = foundset.search();
	}
	
	if(user > 0){
		foundset.client = company;
		databaseManager.saveData(foundset);
		returnText = {
		    "attachments": [
			{
	            "title": foundset.user_name +"connected to, "+ company,
	            "text": '',
	            "color": "#7CD197"
	        }]
		}
		return returnText;
	}
	else {
		if(foundset.find()){
			foundset.client = company.toLowerCase();
			var search = foundset.search();
		}
		if(search == 1){
			if(foundset.user_name == userName){
				return foundset.user_name+' already connected to '+ foundset.client;
			}
			foundset.waiting = userName;
			databaseManager.saveData(foundset);
			
			returnText = {
			    "attachments": [
				{
		            "title": foundset.user_name +" already using it, "+ userName+" is in waiting'",
		            "text": "",
		            "color": "#FFFF99"
		        }]
			}
			return returnText;
	//		return foundset.user_name + ' already using it, '+ userName+' are in waiting';
		} else {
			if(foundset.newRecord()){
				foundset.user_name = userName;
				foundset.client = company.toLowerCase();
				foundset.connect_time = new Date;
				databaseManager.saveData(foundset);
			}
			returnText = {
			    "attachments": [
				{
		            "title": user_name +" connected to, "+ company,
		            "text": "",
		            "color": "#7CD197"
		        }]
			}
			return returnText;
	//		return user_name + ' connected to ' + company;
		}
	}
}

/**
 * disconnect
 * @param {String} userName
 * @param {String} text
 *
 * @properties={typeid:24,uuid:"96F08AF9-EF95-41ED-8AC2-9D1A9163B7BA"}
 * @AllowToRunInFind
 */
function disconnect(userName, text) {
	var connection;
	var returnText ='';
	if(text == ''){
		if(foundset.find()){
			foundset.user_name = userName;
			var search = foundset.search();
		}
		connection = foundset.getSelectedRecord().client;
		var wait = foundset.getSelectedRecord().waiting;
		foundset.deleteRecord(search);
		if(waiting != null || waiting != ''){
			returnText = {
			    "attachments": [
				{
		            "title": "Disconnected from " + connection +", "+ wait + " can connect now" ,
		            "text": "",
		            "color": "#ff0000"
		        }]
			}
		} else {
				returnText = {
				    "attachments": [
					{
			            "title": "Disconnected",
			            "text": "",
			            "color": "#ff0000"
			        }]
				}
		}
		return returnText;
//		return 'Disconnected'
	} else {
		if(foundset.find()){
			foundset.user_name = userName;
			foundset.client = text.toLowerCase();
			foundset.search();
		}
		wait = foundset.getSelectedRecord().waiting;
		foundset.deleteRecord(1);
		if(waiting != null || waiting != ''){
			returnText = {
			    "attachments": [
				{
		            "title": "Disconnected from " + connection +", "+ wait + " can connect now",
		            "text": "" ,
		            "color": "#ff0000"
		        }]
			}
		} else {
				returnText = {
				    "attachments": [
					{
			            "title": "Disconnected",
			            "text": "",
			            "color": "#ff0000"
			        }]
				}
		}
		return returnText;
//		return 'Disconnected from '+ connection;  
	}
}

/**
 * clear
 * @param {String} userName
 *
 * @properties={typeid:24,uuid:"196EF7B9-A3CB-4EB0-8753-60C4D854C441"}
 * @AllowToRunInFind
 */
function clear(userName) {
	var returnText;
	if(foundset.find()){
		foundset.waiting = userName;
		var wait = foundset.search();
	}
	for(var index = 1; index <= wait ; index++){
		var rec = foundset.getRecord(index);
		rec.waiting = '';
		databaseManager.saveData(rec);
	}
	
	if(foundset.find()){
		foundset.user_name = userName;
		var search = foundset.search();
	}
	for(index = 1; index <= search ; index++){
		foundset.deleteRecord(index);
	}
	returnText = {
	    "attachments": [
		{
            "title": "Disconnected",
            "text": "",
            "color": "#ff0000"
        }]
	}
	return returnText;
//	return 'Disconnected'
}

/**
 * whois
 *
 * @properties={typeid:24,uuid:"08B08024-8EE2-4C71-9931-E626A23DC484"}
 */
function whois() {
	var returnText = {
		attachments :[
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		},
		{
			title: null,
			text: null,
			color: null
		}
			
		]
	}
	var q = datasources.db.prosoftweb.connectedto.createSelect();
	
	q.result.add(q.columns.user_name);
	q.result.add(q.columns.client);
	q.result.add(q.columns.waiting);
	
	var qResult = databaseManager.getDataSetByQuery(q,-1);
	var answer = [];
//	var returnText = '{';
//	returnText += '\"attachments\" : [';
			for(var index = 1 ; index <= qResult.getMaxRowIndex() ; index++){
				var row = qResult.getRowAsArray(index);
				if(row[2] == null){
					row[2] = '';
				} else {
					var wait = row[2]
					row[2] = ', In waiting '+ wait; 
				}
				answer[1] = row[0]+' connected to ' +row[1]+' ' + row[2] + ".";
//				returnText += '{';
//				returnText += ' \"title\": \"'+ row[0]+' connected to ' +row[1]+'' + row[2]+'\",';
//				returnText += '\"text\": \"\",';
//				returnText += '\"color\": \"#7CD197\"';
//				if(index == qResult.getMaxRowIndex())
//					returnText += '}'
//				else
//					returnText += '},'
				returnText.attachments[index-1].title = row[0]+' connected to ' +row[1]+' ' + row[2] + ".";
				returnText.attachments[index-1].text = '';
				returnText.attachments[index-1].color = '#7CD197';
//				returnText.attachments.push();
//				returnText.attachments.push(row[0]+' connected to ' +row[1]+' ' + row[2] + ".",'','#7CD197');
			}
			
			for(index =0 ; index < 10; index++){
				if(returnText.attachments[index].title == null){
					delete returnText.attachments[index];
				}
			}

			return returnText;
//	for(var index = 1 ; index <= qResult.getMaxRowIndex() ; index++){
//		var row = qResult.getRowAsArray(index);
//		if(row[2] == null){
//			row[2] = '';
//		} else {
//			var wait = row[2]
//			row[2] = ', In waiting '+ wait; 
//		}
//		answer[1] = row[0]+' connected to ' +row[1]+' ' + row[2] + ".\\";
//		
//		
//	}
//	return answer;
}

/**
 * help
 *
 * @properties={typeid:24,uuid:"12F3F14C-EE71-4242-9009-624B866586C4"}
 */
function help() {
	var helpingText = {
		    "attachments": [
				{
		            "title": "/Connect:",
		            "text": "To connect to client server",
		            "color": "#7CD197"
		        },
				{
		            "title": "/whois:",
		            "text": "To check who is contacted currently to different clients",
		            "color": "#7CD197"
		        },
				{
		            "title": "/disconnect:",
		            "text": "To disconnect from the last client and if connected to multiple connection then mention the name to which you want to disconnect",
		            "color": "#7CD197"
		        },
				{
		            "title": "/clear:",
		            "text": "Disconnectes from all the connections",
		            "color": "#7CD197"
		        },
				{
		            "title": "/help:",
		            "text": "Is to get information of the commands",
		            "color": "#7CD197"
		        }
		    ]
		}
	
	return helpingText;
}