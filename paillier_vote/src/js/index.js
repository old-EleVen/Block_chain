App = {

    web3Provider: null,
    contracts: {},
    //初始化
    init: function(){
		var keys, encA, encB, encAB, encABC;
        return App.initweb3();
    },

    //初始化web3
    initweb3: async function(){
        //获取web3对象
        if (window.ethereum) {
  		App.web3Provider = window.ethereum;
  			try {
    			// Request account access
    			await window.ethereum.enable();
  			} catch (error) {
		// User denied account access...
				console.error("User denied account access")
  			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
  			App.web3Provider = window.web3.currentProvider;
		}
		// If no injected web3 instance is detected, fall back to Ganache
		else {
  			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		}
		web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    //初始化合约
    initContract: function(){
        //拿到Simple.json的内容，回调函数的参数data即为拿到的内容
        $.getJSON("Paillier_vote.json",function(data){
            //得到TruffleContract对象，并赋值给App.contracts.Simple
           App.contracts.Paillier_vote = TruffleContract(data);
           //设置Provider
           App.contracts.Paillier_vote.setProvider(App.web3Provider);
           //调用合约的get方法
           App.get();
           //事件监听，更新显示的内容
           App.watchChanged();
        });

        //调用事件
        App.bindEvents();
    },

    //合约的get方法
    get: function(){
        //deployed得到合约的实例，通过then的方式回调拿到实例
        App.contracts.Paillier_vote.deployed().then(function(instance){
        }).then(function(result){ //异步执行，get方法执行完后回调执行then方法，result为get方法的返回值
            $("#loader").hide();
        }).catch(function(err){ //get方法执行失败打印错误
            console.log(err);
        })
    },
	
    //事件，更新操作
    bindEvents: function(){
		//添加公钥
		$("#btn_add_publickey").click(function(){
            $("#loader").show();
			console.log($("#add_publickey").val());
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.set_publickey.sendTransaction($("#add_publickey").val());
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
         });
		//添加候选人
        $("#btn_add_candidates").click(function(){
            $("#loader").show();
			console.log($("#add_candidates").val());
			var res = $("#add_candidates").val().toString().split(',');
			console.log(res);
			//res.add([0])
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.add_candidates.sendTransaction(res);
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
         });
		$("#btn_add_voters").click(function(){
			$("#loader").show();
			console.log($("#add_voters").val());
			var res = $("#add_voters").val().toString().split(',');
			console.log(res);
			//res.add([0])
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.add_voters.sendTransaction(res);
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
		});
		$("#btn_vote").click(function(){
			$("#loader").show();
			console.log($("#vote").val());
			var vote_addr = $("#vote_addr").val().toString().split(',');
			var vote_count = $("#vote_count").val().toString().split(',');
			console.log(vote_addr,vote_count);
			//res.add([0])
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.votes.sendTransaction(vote_addr,vote_count);
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
		});
		$("#btn_getresult").click(function(){
			$("#loader").show();
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.tally.sendTransaction();
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
		});
		$("#btn_clearvote").click(function(){
			$("#loader").show();
            App.contracts.Paillier_vote.deployed().then(function(instance){
                return instance.clear_vote.sendTransaction();
            }).then(function(result){
                    //App.get(); //set方法执行完后调用get方法，获取最新值（可没有，通常使用事件监听的方式）
					console.log(result);
                }).catch(function(err){
                    console.log(err);
                });
		});
		//密钥生成
		$('#btn_genkeypair').click(function(event) {
			var numBits = parseInt($('#inputNumbits').val());
			console.log(numBits);
			if (numBits % 2 === 0) {
				var startTime = new Date().getTime(),
					elapsed;
				keys = paillier.generateKeys(numBits);
				elapsed = new Date().getTime() - startTime;
				$('#keygentime').html(elapsed);
				$('#pubn').html(keys.pub.n.toString());
				$('#privl').html(keys.sec.lambda.toString());			
			} else {
				alert("Please enter an even number of bits :)");
			}
		});
	
		//加密
		$('#btn_encrypt').click(function(event) {
			var valA = parseInt($('#inputA').val()),
				valB = parseInt($('#inputB').val()),
				startTime,
				elapsed;

			startTime = new Date().getTime();
			encA = keys.pub.encrypt(nbv(valA));
			elapsed = new Date().getTime() - startTime;
			$('#encA').html(encA.toString());
			$('#encAtime').html(elapsed);

			startTime = new Date().getTime();
			encB = keys.pub.encrypt(nbv(valB));
			elapsed = new Date().getTime() - startTime;
			$('#encBtime').html(elapsed);
			$('#encB').html(encB.toString());
		});

		//解密
		$('#btn_decrypt').click(function() {
			var plaintext,
				startTime,
				elapsed,
				txt;
			startTime = new Date().getTime();
			txt = new BigInteger($('#result').val());
			console.log(nbv(txt));
			plaintext = keys.sec.decrypt(txt).toString(10);
			elapsed = new Date().getTime() - startTime;
			$('#plainABC').html(plaintext);
			$('#decrypttime').html(elapsed);
		});
		
    },

    //事件监听
    watchChanged: function(){
        App.contracts.Paillier_vote.deployed().then(function(instance){
            var resultEvent = instance.Get_result();
            resultEvent.watch(function(err, result){
                $("#loader").hide();
				var res = ''
				for(i=0;i<result.args.tally_count.length;i++){
					for (j=0; j<result.args.tally_count[i]['c'].length; j++)
						res += String(result.args.tally_count[i]['c'][j])
					res += ','
				}
                $("#info").html(`获胜者:`+res);
				console.log(result.args);
            })
        });
    }
}

//加载应用
$(function(){
    $(window).load(function(){
        App.init();
    });
});
