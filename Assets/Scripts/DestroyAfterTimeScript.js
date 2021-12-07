
var destroyAfterTime : float = 15;
var destroyAfterTimeRandomization : float = 0;
@HideInInspector
var countToTime : float;

function Awake()
{
	destroyAfterTime += Random.value * destroyAfterTimeRandomization;
}

function Start () {

}

function Update () 
{
	countToTime += Time.deltaTime;
	if(countToTime >= destroyAfterTime)
		Destroy(gameObject);
}