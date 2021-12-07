
var cameraObject : GameObject;
@HideInInspector
var targetXRotation : float;
@HideInInspector
var targetYRotation : float;
@HideInInspector
var targetXRotationV : float;
@HideInInspector
var targetYRotationV : float;

var rotateSpeed : float = 0.3;

var holdHeight : float = -0.5;
var holdSide : float = 0.5;
var racioHipHold : float = 1;
var hipToAimSpeed : float = 0.1;
@HideInInspector
var racioHipHoldV : float;

var aimRacio : float = 0.4;

var zoomAngle : float = 30;

var fireSpeed : float = 15;
@HideInInspector
var waitTilNextFire : float = 0;
var bullet : GameObject;
var bulletSpawn : GameObject;

var shootAngleRandomizationAiming : float = 5;
var shootAngleRandomizationNotAiming : float = 15;

var recoilAmount : float = 0.5;
var recoilRecoverTime : float = 0.2;
@HideInInspector
var currentRecoilZPos : float;
@HideInInspector
var currentRecoilZPosV : float;

var bulletSound : GameObject;
var muzzelFlash : GameObject;

function Update () 
{
	var holdMuzzelFlash : GameObject;
	var holdSound : GameObject;
	if (Input.GetButton("Fire1"))
	{
		if (waitTilNextFire <= 0)
		{
			if (bullet)
				Instantiate(bullet,bulletSpawn.transform.position, bulletSpawn.transform.rotation);
			if (bulletSound)
				holdSound = Instantiate(bulletSound, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
			if (muzzelFlash)
				holdMuzzelFlash = Instantiate(muzzelFlash, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
			targetXRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, racioHipHold);
			targetYRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, racioHipHold);
			currentRecoilZPos -= recoilAmount;
			waitTilNextFire = 1;
		}
	}
	waitTilNextFire -= Time.deltaTime * fireSpeed;

	if (holdSound)
		holdSound.transform.parent = transform;
	if (holdMuzzelFlash)
		holdMuzzelFlash.transform.parent = transform;

	currentRecoilZPos = Mathf.SmoothDamp( currentRecoilZPos, 0, currentRecoilZPosV, recoilRecoverTime);

	cameraObject.GetComponent(MouseLookScript).currentTargetCameraAngle = zoomAngle;

	if (Input.GetButton("Fire2")){
		cameraObject.GetComponent(MouseLookScript).currentAimRacio = aimRacio;
		racioHipHold = Mathf.SmoothDamp(racioHipHold, 0, racioHipHoldV, hipToAimSpeed);}
	if (Input.GetButton("Fire2") == false){
		cameraObject.GetComponent(MouseLookScript).currentAimRacio = 1;
		racioHipHold = Mathf.SmoothDamp(racioHipHold, 1, racioHipHoldV, hipToAimSpeed);}

	transform.position = cameraObject.transform.position + (Quaternion.Euler(0,targetYRotation,0) * Vector3(holdSide * racioHipHold, holdHeight * racioHipHold, 0) + Quaternion.Euler(targetXRotation, targetYRotation, 0) * Vector3(0,0,currentRecoilZPos));
	
	targetXRotation = Mathf.SmoothDamp( targetXRotation, cameraObject.GetComponent(MouseLookScript).xRotation, targetXRotationV, rotateSpeed);
	targetYRotation = Mathf.SmoothDamp( targetYRotation, cameraObject.GetComponent(MouseLookScript).yRotation, targetYRotationV, rotateSpeed);
	
	transform.rotation = Quaternion.Euler(targetXRotation, targetYRotation, 0);
}































//cameraObject.GetComponent(MouseLookScript).currentTargetCameraAngle = zoomAngle;