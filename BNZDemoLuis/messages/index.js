/*-----------------------------------------------------------------------------
  This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
  For a complete walkthrough of creating this type of bot see the article at
  https://aka.ms/abs-node-waterfall
  -----------------------------------------------------------------------------*/
  "use strict";
  var builder = require("botbuilder");
  var botbuilder_azure = require("botbuilder-azure");
  var path = require('path');
  var sql = require('mssql');
  sql.close();
  var connection = {
                  server: 'bnzkiwi.database.windows.net',
                  user: 'bnz_kiwi',
                  password: 'Admin1234',
                  database: 'bnzkiwi',
                  options: {
                      encrypt: true
                  }
              };
        sql.connect(connection, function (err) {
          if(err){
            console.log(err);
            console.log("Error in connection");
          }else{
            console.log("DB Connected");
         }
       });
 
 var useEmulator = (process.env.NODE_ENV == 'development');
  var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
      appId: process.env['MicrosoftAppId'],
      appPassword: process.env['MicrosoftAppPassword'],
      stateEndpoint: process.env['BotStateEndpoint'],
      openIdMetadata: process.env['BotOpenIdMetadata']
  });
          var bot = new builder.UniversalBot(connector);
          bot.localePath(path.join(__dirname, './locale'));
          var luisAppId= "226b9b21-3f55-4a43-bf00-5fbd37e2a34c";
          var luisAPIKey = "f75b5f83e18347ec8b09a6391b0a1c0c";
          var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
          const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6e397fb1-f566-4e05-9f43-bd41beee62b5?subscription-key=f75b5f83e18347ec8b09a6391b0a1c0c&timezoneOffset=0&verbose=true&q=';
          var recognizer = new builder.LuisRecognizer(LuisModelUrl);
          var intents = new builder.IntentDialog({ recognizers: [recognizer] })
         
          
          .onDefault((session, args) => {
             
           var categoriesPresent = ['#Account_Balance_Inquiry','#Account_Access_Inquiry', '#Asset_Allocation_Inquiry', '#Change_Funds_Inquiry', '#Change_Funds_Request','#Compare_Funds_Inquiry','#Comparing_Competitors_Inquiry','#Contact_Details_Request','#Contributions_Holiday_Inquiry','#Contributions_Inquiry','#Employer_Contributions_Inquiry','#Ethical_Investment_Inquiry','#Fees_Inquiry','#Financial_Hardship_Inquiry','#Fund_Manager_Inquiry','#Fund_Performance_Inquiry','#Fund_Split_Inquiry','#General_Eligibility_Inquiry','#General_KiwiSaver_Inquiry','#Government_Incentives_Inquiry','#Investment_Benefits_Inquiry','#Investment_Risks_Inquiry','#Investment_Trustee_Inquiry','#Lifetime_Performance_Inquiry','#List_Funds_Inquiry','#Member_Tax_Credit_Inquiry','#My_Current_Fund_Inquiry','#Open_Account_Inquiry','#Personal_Calculator_Inquiry','#Recommendation_Inquiry','#Recommendation_Rationale','#Specific_Fund_Inquiry','#Statement_Request','#Tax_Payment_Inquiry','#Transfer_Funds_Inquiry','#Withdraw_Funds_Eligibility','#Withdraw_Funds_Inquiry','#Withdrawing_To_Buy_First_Home','None'];
         
           var foundPresent = categoriesPresent.indexOf(args.intent) > -1;
        
            var conn = new sql.ConnectionPool(connection);
           var reqs = new sql.Request(conn);
           conn.connect(function(err){
           if(err){
           
           res.send({"code": 401, "message":err},401);
         
           }else{
            if(foundPresent){
                
                   //session.send('args.intent =  %S', args.intent);
                  // session.send('args.intent =  %f', args.score);
 
              if(args.score>.60){
                  
                  var statM =  "\'"+ args.intent +"\'";
                 var Stat = "SELECT RESPONSE,FOLLOWUP1,FOLLOWUP2,FOLLOWUP3,FOLLOWUP4,FOLLOWUP5 FROM Response_Int$ WHERE INTENT =" + statM;
                //var Stat = "SELECT FOLLOWUP1,FOLLOWUP2,FOLLOWUP3,FOLLOWUP4,FOLLOWUP5 FROM Response_Int$ WHERE INTENT =" + statM;

                  reqs.query(Stat, function(err,data){
                    
                     if(err){
                        
                       //session.send(JSON.stringify(err));
 
                    
                      }else{
                          
                        var array = [];
                        var responseN='';
                        var response = '';
                        var response1 = '';
                        var response2 = '';
                        var response3 = '';
                        var response4 ='';
                        
                        if(data.recordsets[0][0].responseN !== null){
                            
                           responseN  = data.recordsets[0][0].RESPONSE; 
                          
                        }
                        
                        if(data.recordsets[0][0].response !== null){
                            
                            response = data.recordsets[0][0].FOLLOWUP1;
                             array.push(response);
                        }
                        if(data.recordsets[0][0].response1 !== null){
                            
                           response1  = data.recordsets[0][0].FOLLOWUP2; 
                            array.push(response1);
                        }
                        if(data.recordsets[0][0].response2 !== null){
                            
                           response2  = data.recordsets[0][0].FOLLOWUP3; 
                           array.push(response2);
                        }
                        if(data.recordsets[0][0].response3 !== null){
                            
                           response3  = data.recordsets[0][0].FOLLOWUP4; 
                           array.push(response3);
                        }
                        if(data.recordsets[0][0].response4 !== null){
                            
                           response4  = data.recordsets[0][0].FOLLOWUP5; 
                            array.push(response4);
                        }
                       
                        if(responseN === 'Coming Soon….'){
                       
                        
                         var dummmyMSG =  "\'"+ session.message.text +"\'";
                       
                           var textMessage = 'Your question  ' + dummmyMSG + ' We are working on the response';
                        
                         
                         if(array.length < 2){
                           
                             var msg = new builder.Message(session)
                             .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                             
                             ]
                            ));
                          session.send(msg);
                         }
                         else if(array.length < 3){
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                            
                             ]
                            ));
                        session.send(msg);
                            
                         }
                       
                         else if(array.length < 4){
                           
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                             ]
                            ));
                            session.send(msg);
                            
                         }else if(array.length < 5){
                           
                             
                             var msg = new builder.Message(session)
                           .text(textMessage)
                   
                            .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]),(array[0])),
                                builder.CardAction.imBack(session, (array[1]),(array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                             ]
                            ));
                           session.send(msg);
                            
                         }else if(array.length < 6){
                            
                              var msg = new builder.Message(session)
                              .text(textMessage)
                   
                              .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                             ]
                            ));
                         session.send(msg);
                            
                         }else if(array.length < 7){
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                            .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                                builder.CardAction.imBack(session, (array[5]), (array[5])),
                             ]
                            ));
                          session.send(msg);
                            
                         }else{
                           
                             //sessionsend('eror123');
                           
                         }
                        }
                        else{
                          
                       
                          if(array.length < 2){
                           
                             var msg = new builder.Message(session)
                               .text(responseN)
                   
                                .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                             
                             ]
                            ));
                     session.send(msg);
                         }
                         else if(array.length < 3){
                             var msg = new builder.Message(session)
                     .text(responseN)
                     
                     .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                            
                             ]
                            ));
                       session.send(msg);
                            
                         }
                       
                         else if(array.length < 4){
                           
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                             ]
                            ));
                       session.send(msg);
                            
                         }else if(array.length < 5){
                             
                             
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                             ]
                            ));
          session.send(msg);
                            
                         }else if(array.length < 6){
                           
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                             ]
                            ));
          session.send(msg);
                            
                         }else if(array.length < 7){
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                   [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                                builder.CardAction.imBack(session, (array[5]), (array[5])),
                             ]
                            ));
                         session.send(msg);
                            
                         }
                         
                        } 
                        
                        
                      
                          conn.close();
                      }
                  });
              }else if(args.score<.60 && args.score>.30  ){
                  
                  var statM =  "\'"+ args.intent +"\'";
                 var Stat = "SELECT DIDYOUMEAN,FOLLOWUP1,FOLLOWUP2,FOLLOWUP3,FOLLOWUP4,FOLLOWUP5 FROM Response_Int$ WHERE INTENT =" + statM;
                //var Stat = "SELECT FOLLOWUP1,FOLLOWUP2,FOLLOWUP3,FOLLOWUP4,FOLLOWUP5 FROM Response_Int$ WHERE INTENT =" + statM;

                  reqs.query(Stat, function(err,data){
                    
                     if(err){
                        
                       session.send(JSON.stringify(err));
 
                    
                      }else{
                          
                        var array = [];
                        var responseN='';
                        var response = '';
                        var response1 = '';
                        var response2 = '';
                        var response3 = '';
                        var response4 ='';
                        
                        if(data.recordsets[0][0].responseN !== null){
                            
                           responseN  = data.recordsets[0][0].RESPONSE; 
                          
                        }
                        
                        if(data.recordsets[0][0].response !== null){
                            
                            response = data.recordsets[0][0].FOLLOWUP1;
                             array.push(response);
                        }
                        if(data.recordsets[0][0].response1 !== null){
                            
                           response1  = data.recordsets[0][0].FOLLOWUP2; 
                            array.push(response1);
                        }
                        if(data.recordsets[0][0].response2 !== null){
                            
                           response2  = data.recordsets[0][0].FOLLOWUP3; 
                           array.push(response2);
                        }
                        if(data.recordsets[0][0].response3 !== null){
                            
                           response3  = data.recordsets[0][0].FOLLOWUP4; 
                           array.push(response3);
                        }
                        if(data.recordsets[0][0].response4 !== null){
                            
                           response4  = data.recordsets[0][0].FOLLOWUP5; 
                            array.push(response4);
                        }
                       
                        if(responseN === 'Coming Soon….'){
                       
                        
                         var dummmyMSG =  "\'"+ session.message.text +"\'";
                       
                           var textMessage = 'Your question  ' + dummmyMSG + ' We are working on the response';
                        
                         
                         if(array.length < 2){
                           
                             var msg = new builder.Message(session)
                             .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                             
                             ]
                            ));
                          session.send(msg);
                         }
                         else if(array.length < 3){
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                            
                             ]
                            ));
                        session.send(msg);
                            
                         }
                       
                         else if(array.length < 4){
                           
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                             .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                             ]
                            ));
                            session.send(msg);
                            
                         }else if(array.length < 5){
                           
                             
                             var msg = new builder.Message(session)
                           .text(textMessage)
                   
                            .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]),(array[0])),
                                builder.CardAction.imBack(session, (array[1]),(array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                             ]
                            ));
                           session.send(msg);
                            
                         }else if(array.length < 6){
                            
                              var msg = new builder.Message(session)
                              .text(textMessage)
                   
                              .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                             ]
                            ));
                         session.send(msg);
                            
                         }else if(array.length < 7){
                             var msg = new builder.Message(session)
                            .text(textMessage)
                   
                            .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                                builder.CardAction.imBack(session, (array[5]), (array[5])),
                             ]
                            ));
                          session.send(msg);
                            
                         }else{
                           
                             sessionsend('');
                           
                         }
                        }
                        else{
                          session.send(responseN);
                       
                          if(array.length < 2){
                           
                             var msg = new builder.Message(session)
                               .text(responseN)
                   
                                .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                             
                             ]
                            ));
                     session.send(msg);
                         }
                         else if(array.length < 3){
                             var msg = new builder.Message(session)
                     .text(responseN)
                     
                     .suggestedActions(builder.SuggestedActions.create(session,
                                [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                            
                             ]
                            ));
                       session.send(msg);
                            
                         }
                       
                         else if(array.length < 4){
                           
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                             ]
                            ));
                       session.send(msg);
                            
                         }else if(array.length < 5){
                             
                             
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                             ]
                            ));
          session.send(msg);
                            
                         }else if(array.length < 6){
                           
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                 [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                             ]
                            ));
          session.send(msg);
                            
                         }else if(array.length < 7){
                             var msg = new builder.Message(session)
                     .text(responseN)
                   
                     .suggestedActions(builder.SuggestedActions.create(session,
                                   [builder.CardAction.imBack(session, (array[0]), (array[0])),
                                builder.CardAction.imBack(session, (array[1]), (array[1])),
                                builder.CardAction.imBack(session, (array[2]), (array[2])),
                                builder.CardAction.imBack(session, (array[3]), (array[3])),
                                builder.CardAction.imBack(session, (array[4]), (array[4])),
                                builder.CardAction.imBack(session, (array[5]), (array[5])),
                             ]
                            ));
                         session.send(msg);
                            
                         }
                         
                        } 
                        
                        
                      
                          conn.close();
                      }
                  });
              }else{
                  
                  session.send('I’m sorry, I’m still learning and I didn’t understand that.  Can you please try rewording.');

              }
                
            }
            else{
        
                if(args.intent ==='#Closing'){
                 
                   session.send("Thank you for chatting with me today. I hope we were able to answers your questions! Please come back if there are any questions I can help answer about KiwiSaver at BNZ");
             
                }else if(args.intent ==='#Greeting'){
        
                 var msg = new builder.Message(session)
                     .text("Hi! I’m the BNZ KiwiSaver Chatbot. I’m here to help answer your questions about KiwiSaver Retirement Investments with BNZ. Where would you like to begin today?")
                     .suggestedActions(
                                 builder.SuggestedActions.create(
                     session, [
                 
                         //builder.CardImage.create(session, "https://www.example.org/img1.gif")
                                                                                builder.CardAction.imBack(session, "Learn about KiwiSaver", "Learn about KiwiSaver"),
                                                                                builder.CardAction.imBack(session, "Available BNZ KiwiSaver funds", "Available BNZ KiwiSaver funds"),
                                                                                builder.CardAction.imBack(session, "My KiwiSaver Account", "My KiwiSaver Account")
                                                                ]
                                               ));
          session.send(msg);
             
            }else{
            
                 session.send('I’m sorry, I’m still learning and I didn’t understand that.  Can you please try rewording.');
              
            }
        
          }
       
           }
           });
});
     
 
        
 
      bot.dialog('/', intents);
  if (useEmulator) {
      var restify = require('restify');
      var server = restify.createServer();
      server.listen(3978, function() {
          console.log('test bot endpont at http://localhost:3978/api/messages');
      });
      server.post('/api/messages', connector.listen());
  } else {
      module.exports = { default: connector.listen() }
}