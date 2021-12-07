var forceRandomness : float = 50;
var forceAdd : Vector3;
 
function Awake () 
{
    rigidbody.AddRelativeForce( forceAdd + Vector3((Random.value * 2 - 1) * forceRandomness, (Random.value * 2 - 1) * forceRandomness, (Random.value * 2 - 1) * forceRandomness));
}