
var maxDist : float = 100000000;
var decalHitWall : GameObject;
var floatInFrontOfWall : float = 0.001;

var damage : float = 1;
var bulletForce : float = 1000;


function Start () 
{
	var hit : RaycastHit;
	if(Physics.Raycast(transform.position, transform.forward, hit, maxDist))
	{
		Debug.DrawLine (transform.position, hit.point, Color.red,2);
		Debug.Log(hit.transform.gameObject.name);
		//Debug.Log(hit.transform.gameObject.tag);
		if(decalHitWall && hit.transform.tag == "Level Parts" || decalHitWall && hit.transform.tag == "AIPathCell")
			Instantiate(decalHitWall, hit.point + (hit.normal * floatInFrontOfWall), Quaternion.LookRotation(hit.normal));
		if(hit.transform.tag == "EnemyBodyPart")
		{
			//Debug.DrawLine (transform.position, hit.point, Color.red,1);
			//Debug.Log(hit.transform.GetComponent(EnemyBodyPartScript).damageMultiplyer);
			if (hit.transform.GetComponent(EnemyBodyPartScript).enemyBody.GetComponent(EnemyBodyScript).enemyHealth > damage * hit.transform.GetComponent(EnemyBodyPartScript).damageMultiplyer)
				hit.transform.GetComponent(EnemyBodyPartScript).enemyBody.GetComponent(EnemyBodyScript).enemyHealth -= damage * hit.transform.GetComponent(EnemyBodyPartScript).damageMultiplyer;		
			else
			{
				hit.transform.GetComponent(EnemyBodyPartScript).enemyBody.GetComponent(EnemyBodyScript).enemyHealth -= damage * hit.transform.GetComponent(EnemyBodyPartScript).damageMultiplyer;
				hit.transform.GetComponent(EnemyBodyPartScript).addForceVector = transform.forward * bulletForce;
			}
			//Debug.Log(hit.transform.GetComponent(EnemyBodyPartScript).enemyBody.GetComponent(EnemyBodyScript).enemyHealth);
		}
	}
	Destroy(gameObject);
}

function Update () {
	
}