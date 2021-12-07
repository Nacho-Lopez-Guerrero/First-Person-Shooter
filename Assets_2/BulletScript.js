var maxDist : float = 1000000000;
var decalHitWall : GameObject;
var floatInFrontOfWall : float = 0.00001;

function Update () 
{
	var hit : RaycastHit;
	if (Physics.Raycast(transform.position, transform.forward, hit, maxDist))
	{
		if (decalHitWall && hit.transform.tag == "Level Parts")
			Instantiate(decalHitWall, hit.point + (hit.normal * floatInFrontOfWall), Quaternion.LookRotation(hit.normal));
	}
	Destroy(gameObject);
}