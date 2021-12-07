var speed : float = 50;
var damage : float = 20;
var playerTransform : Transform;
 
function Awake ()
{
    playerTransform = GameObject.FindWithTag("Player").transform;
}
 
function Update () 
{
    transform.position += transform.forward * Time.deltaTime * speed;
    if (Vector3.Distance(transform.position, playerTransform.position) < 1)
    {
        playerTransform.GetComponent(PlayerMovementScript).health -= damage;
        Destroy(gameObject);
    }
}