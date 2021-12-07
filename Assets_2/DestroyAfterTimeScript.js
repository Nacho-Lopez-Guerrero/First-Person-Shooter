var destroyAfterTime : float = 30;
var destroyAfterTimeRandomization : float = 0;
@HideInInspector
var countToTime : float;

function Awake ()
{
	destroyAfterTime += Random.value * destroyAfterTimeRandomization;
}

function Update () 
{
	countToTime += Time.deltaTime;
	if (countToTime >= destroyAfterTime)
		Destroy(gameObject);
}