var Simple = artifacts.require("Simple");

contract('Simple', function(accounts){
    it("set() should be equal set", function(){
        return Simple.deployed().then(function(instance){
            instance.set("中本聪", 18);

            return instance.get().then(function(data){
                assert.equal(data[0], "中本聪");
                assert.equal(data[1], 18);
            });
        });
    });
});
