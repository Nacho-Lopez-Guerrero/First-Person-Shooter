var bullet : GameObject;
var bulletSpawn : Transform;

var fireSpeed : float = 10; //in bullets per second
var trackFire : float = 0;

var fireBurstTime : float = 1;
var fireBurstRandomAdd : float = 0.5;

var burstPauseTime : float = 2;
var burstPauseRandomAdd : float = 1;

var trackBurst : float;
var trackBurstPause : float;

var enemyBodyTransform : Transform;
@HideInInspector
var origLocalPos : Vector3;
var target : Transform;
var turnSpeed : float = 20;
var targetRotation : Quaternion;
var unaccuracy : float = 10;
var maxAngle : float = 15;
var angleStartShoot : float = 15;

var bodyScript : EnemyBodyScript;
var movementScript : EnemyMovementScript;

var recoilChild : Transform;
var recoilUpAngle : float = 5;
var recoilRandomAngle : float = 1;
var recoilZAmount : float = 1;
var recoilRecoverTime : float = 0.1;

@HideInInspector
var recoilRotationVX : float;
@HideInInspector
var recoilRotationVY : float;
@HideInInspector
var recoilPositionVZ : float;
@HideInInspector
var recoilRotationX : float;
@HideInInspector
var recoilRotationY : float;
@HideInInspector
var recoilPositionZ : float;

function Awake ()
{
	if (target == null)
		target = GameObject.FindWithTag("Player").transform;
	trackBurst = fireBurstTime;
	origLocalPos = transform.localPosition;
}

function Update ()
{
	if (movementScript.aware && bodyScript.enemyHealth > 0)
	{
		transform.localPosition = origLocalPos;
		if (trackBurst > 0)
		{
			trackBurst -= Time.deltaTime;
			if (trackBurst <= 0)
				trackBurstPause = burstPauseTime + (Random.value * burstPauseRandomAdd);
		}
		if (trackBurstPause > 0)
		{
			trackBurstPause -= Time.deltaTime;
			if ( trackBurstPause <= 0)
				trackBurst = fireBurstTime + (Random.value * fireBurstRandomAdd);
		}
		
		if (trackFire > 0)
			trackFire -= Time.deltaTime * fireSpeed;
		if (trackFire <= 0 && trackBurst > 0 && Vector3.Angle(transform.forward, target.position - transform.position) < angleStartShoot)
		{
			Instantiate(bullet, bulletSpawn.position, bulletSpawn.rotation);
			recoilRotationX += (Random.value * 2 - 1) * recoilRandomAngle - recoilUpAngle;
			recoilRotationY += (Random.value * 2 - 1) * recoilRandomAngle;
			recoilPositionZ -= recoilZAmount;
			trackFire = 1;
		}
		
		if (Vector3.Angle(enemyBodyTransform.forward, target.position - transform.position) < maxAngle)
			targetRotation = Quaternion.LookRotation(target.position - transform.position);
		else
			targetRotation = Quaternion.LookRotation(enemyBodyTransform.forward);
		targetRotation *= Quaternion.Euler(Random.Range(-unaccuracy, unaccuracy),Random.Range(-unaccuracy, unaccuracy),0);
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);

	}
	
	recoilRotationX = Mathf.SmoothDamp( recoilRotationX, 0, recoilRotationVX, recoilRecoverTime);
	recoilRotationY = Mathf.SmoothDamp( recoilRotationY, 0, recoilRotationVY, recoilRecoverTime);
	recoilPositionZ = Mathf.SmoothDamp( recoilPositionZ, 0, recoilPositionVZ, recoilRecoverTime);
	
	recoilChild.localPosition = Vector3(0,0, recoilPositionZ);
	recoilChild.localRotation = Quaternion.Euler( recoilRotationX, recoilRotationY, 0);
}