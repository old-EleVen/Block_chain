pragma solidity ^0.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Simple.sol";

contract TestSimple {

    Simple info = Simple(DeployedAddresses.Simple());

    string name;
    uint age;

    function testInfo() public {

        info.set("中本聪",18);
        (name, age) = info.get();

        Assert.equal(name, "中本聪", "设置姓名出错");
        Assert.equal(age, 18, "设置年龄出错");
    }
}
