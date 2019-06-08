pragma solidity ^ 0.5;

contract Paillier_vote{
    
    uint[] result;
    //选举人
    struct voter{
        int vote;   //是否投票
        address vaddr;
    }
    
    //候选者
    struct candidate {
        uint count;     //统计票数
        bool win;       //是否获胜
    }   
    
    event Get_result(uint[] tally_count);
    //管理者
    address administrator;
    
    //选举人
    mapping(address => voter) voters;
    
    //候选者
    mapping(address => candidate) candidates;
    address[] c_addr;
    address[] v_addr;
    //公钥
    uint Publickey_n;
    uint Publickey_n2;
    
    //函数修改器
    modifier onlyOwner {
        require(msg.sender == administrator);
        _;
    }
    
    modifier iseligible {
        require(voters[msg.sender].vaddr!=address(0));
        _;
    }
    
    constructor () payable public {
        administrator = msg.sender;
    }
    
    function set_publickey(uint n) public onlyOwner {
        Publickey_n = n;
        Publickey_n2 = n*n;
    }
    
    //管理者添加候选者
    function add_candidates(address[] memory caddrs) payable public onlyOwner returns(address)  {
        for(uint256 i=0;i<caddrs.length;i++) {
            candidates[caddrs[i]].count =0;
            candidates[caddrs[i]].win = false;
            c_addr.push(caddrs[i]);
        }
    }
    
    //管理者添加投票人资格
    function add_voters(address[] memory vaddrs) public onlyOwner {
        for(uint256 i=0;i<vaddrs.length;i++) {
            voters[vaddrs[i]].vote = 1; 
            voters[vaddrs[i]].vaddr = vaddrs[i];
            v_addr.push(vaddrs[i]);
        }
    }
    
    function votes(address[] memory candidate_address,uint[] memory Evotes) public{
        require(voters[msg.sender].vote >0);
        for (uint i=0;i<candidate_address.length;i++){
            if(candidates[candidate_address[i]].count == 0){
                candidates[candidate_address[i]].count = Evotes[i];
            }else{
                candidates[candidate_address[i]].count = mulmod(candidates[candidate_address[i]].count,Evotes[i],Publickey_n2);
            }
        }
        voters[msg.sender].vote = 0;
    }
    
    function tally()  public onlyOwner returns(uint[] memory,uint){
        delete result;
        // uint winner_count;
        for(uint i=0;i<c_addr.length;i++){
            result.push(candidates[c_addr[i]].count);
        }
        emit Get_result(result);
        return(result,v_addr.length);
    }
    
    function clear_vote() public onlyOwner{
        for(uint i=0;i<c_addr.length;i++){
            delete candidates[c_addr[i]];
        }
        for(uint i=0;i<v_addr.length;i++){
            delete voters[v_addr[i]];
        }
        delete c_addr;
        delete v_addr;
    }
}
