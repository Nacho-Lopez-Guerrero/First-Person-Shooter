
@HideInInspector //Ya no necesitamos asignar camara en inspector
var cameraObject : GameObject;
@HideInInspector
var cameraTransform : Transform;
@HideInInspector
var targetXRotation : float;
@HideInInspector
var targetYRotation : float;
@HideInInspector
var targetXRotationV : float;
@HideInInspector
var targetYRotationV : float;

var rotateSpeed : float = 0.05;

var holdHeight : float = -0.26;
var holdSide : float = 0.59;
@HideInInspector
var ratioHipHold : float = 1;
var hipToAimSpeed : float = 0.1;
@HideInInspector
var ratioHipHoldV : float;

var aimRatio : float = 0.5;
var zoomAngleFOV : float = 30;

var fireSpeed : float = 15;
@HideInInspector
var waitTilNextFire : float = 0;
var bulletSpawn : GameObject;
var bullet : GameObject;

var shootAngleRandomizationAiming : float = 5;
var shootAngleRandomizationNotAiming : float = 15;

var recoilAmount : float = 0.07;
var recoilRecoverTime : float = 0.2;
@HideInInspector
var currentRecoilZPos : float;
@HideInInspector
var currentRecoilZPosV : float;

var bulletSound : GameObject;
var muzzelFlash : GameObject;

var gunbobAmountX : float = 0.1;
var gunbobAmountY : float = 0.05;
var currentGunbobX : float;
var currentGunbobY : float;
var beingHeld : boolean = false;
var outsideBox : GameObject;
@HideInInspector
var countToThrow : int = -1;
@HideInInspector
var playerTransform : Transform;
@HideInInspector
var playerMovementScript : PlayerMovementScript;

var gunModelObjects : GameObject[];

var reloading : boolean = false;
var reloadAnimation : Animation;
var reloadAnimationString : String;
var reloadSound : AudioSource;

var clipSize : int = 12;
var currentClip  : int = 12;
var maxExtraAmmo : int = 100;
var currentExtraAmmo : int = 100;
var ammoType : int = 0;

var bulletHudTexture : Texture;
var ammoCountRectangle : Rect = Rect(25,25,50,25);
var ammoStartX : int = 100;
var ammoY : int = 25;
var ammoSize : Vector2 = Vector2(10,25);
var ammoSpacing : int = 4;
var ammoDecorationHudRect : Rect = Rect(25,50,50,25);
var ammoDecorationTexture : Texture;

function Awake()
{
	cameraTransform = GameObject.FindWithTag("MainCamera").transform;
	countToThrow = -1;
	playerTransform = GameObject.FindWithTag("Player").transform;
	playerMovementScript =  GameObject.FindWithTag("Player").GetComponent(PlayerMovementScript);
	cameraObject = GameObject.FindWithTag("MainCamera");
}

function Start () {

}

function LateUpdate () 
{
	if(currentClip > clipSize)
		currentClip = clipSize;
	if(currentExtraAmmo > maxExtraAmmo)
		currentExtraAmmo = maxExtraAmmo;
	if(currentClip < 0)
		currentClip = 0;
	if(maxExtraAmmo < 0)
		maxExtraAmmo = 0;
		
	if(beingHeld)
	{
		//Animamaos recarga del arma
		if(!reloading && Input.GetButtonDown("Reload") && currentClip < clipSize && currentExtraAmmo > 0)
		{
			reloading = true;
			reloadAnimation.Play(reloadAnimationString);
			reloadSound.Play();
		}
		if(!reloading && Input.GetButtonDown("Fire1") && currentClip == 0 && currentExtraAmmo > 0)
		{
			reloading = true;
			reloadAnimation.Play(reloadAnimationString);
			reloadSound.Play();
		}
		//Hacemos efectiva la recarga
		if(reloading && !reloadAnimation.IsPlaying(reloadAnimationString))
		{
			if(currentExtraAmmo >= clipSize - currentClip)
			{
				currentExtraAmmo -= clipSize - currentClip;
				currentClip = clipSize;
			}
			if(currentExtraAmmo < clipSize - currentClip)
			{
				currentClip += currentExtraAmmo;
				currentExtraAmmo = 0;
			}
			reloading = false;
		}
		
		for(var modelObject : GameObject in gunModelObjects)
		{
			modelObject.layer = 8;
		}
		rigidbody.useGravity = false;
		outsideBox.GetComponent(Collider).enabled = false;
	
		currentGunbobX = Mathf.Sin(cameraObject.GetComponent(MouseLookScript).headboobStepCounter) * gunbobAmountX * ratioHipHold;
		currentGunbobY = Mathf.Cos(cameraObject.GetComponent(MouseLookScript).headboobStepCounter * 2) * gunbobAmountY * -1 * ratioHipHold;
	
		var holdMuzzelFlash : GameObject;
		var holdSound : GameObject;	
		if(Input.GetButton("Fire1") && currentClip > 0 && !reloading)
		{
			if(waitTilNextFire <= 0)
			{
				currentClip -= 1;
				if(bullet)
					Instantiate(bullet, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
				if(bulletSound)
					holdSound = Instantiate(bulletSound, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
				if(muzzelFlash)
					holdMuzzelFlash = Instantiate(muzzelFlash, bulletSpawn.transform.position, bulletSpawn.transform.rotation);
				targetXRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, ratioHipHold);
				targetYRotation += (Random.value - 0.5) * Mathf.Lerp(shootAngleRandomizationAiming, shootAngleRandomizationNotAiming, ratioHipHold);
				currentRecoilZPos -= recoilAmount;
				waitTilNextFire = 1;
			}
		}
		waitTilNextFire -= Time.deltaTime * fireSpeed;
	
		if(holdSound)
			holdSound.transform.parent = transform;
		if(holdMuzzelFlash)
			holdMuzzelFlash.transform.parent = transform;	
		currentRecoilZPos = Mathf.SmoothDamp(currentRecoilZPos, 0, currentRecoilZPosV, recoilRecoverTime);
	
		cameraObject.GetComponent(MouseLookScript).currentTargetCameraAngle = zoomAngleFOV;
		if(Input.GetButton("Fire2") && !reloading)
		{
			cameraObject.GetComponent(MouseLookScript).currentAimRatio = aimRatio;	//Sensibildiad apuntando
			ratioHipHold = Mathf.SmoothDamp(ratioHipHold, 0, ratioHipHoldV, hipToAimSpeed);
		}
		if(!Input.GetButton("Fire2") || reloading)
		{
			cameraObject.GetComponent(MouseLookScript).currentAimRatio = 1;
			ratioHipHold = Mathf.SmoothDamp(ratioHipHold, 1, ratioHipHoldV, hipToAimSpeed);
		}
		transform.position = cameraObject.transform.position + (Quaternion.Euler(0,targetYRotation,0) * Vector3(holdSide  * ratioHipHold + currentGunbobX, holdHeight * ratioHipHold + currentGunbobY, 0) + Quaternion.Euler(targetXRotation, targetYRotation, 0) * Vector3(0,0, currentRecoilZPos));

		targetXRotation = Mathf.SmoothDamp(targetXRotation, cameraObject.GetComponent(MouseLookScript).xRotation, targetXRotationV, rotateSpeed);
		targetYRotation = Mathf.SmoothDamp(targetYRotation, cameraObject.GetComponent(MouseLookScript).yRotation, targetYRotationV, rotateSpeed);

		transform.rotation = Quaternion.Euler(targetXRotation, targetYRotation, 0);
	}
	
	if(!beingHeld)
	{
		for(var modelObject : GameObject in gunModelObjects)
		{
			modelObject.layer = 0;
		}
		
		rigidbody.useGravity = true;
		outsideBox.GetComponent(Collider).enabled = true;
		
		countToThrow -= 1;
		if(countToThrow == 0)
			rigidbody.AddRelativeForce(0, playerMovementScript.throwGunUpForce, playerMovementScript.throwGunForwardForce);
		//Si esta suficiente cerca como para cogerla del suelo
		var angle : float = Vector3.Angle(outsideBox.transform.position - cameraTransform.position, outsideBox.transform.position + (cameraTransform.right * outsideBox.transform.localScale.magnitude) - cameraTransform.position);
		if(Vector3.Angle(outsideBox.transform.position - cameraTransform.position, cameraTransform.forward) < angle)
		if(Vector3.Distance(transform.position, playerTransform.position) < playerMovementScript.distToPickUpGun && Input.GetButtonDown("Use Key") && playerMovementScript.waitFrameForSwitchGuns <= 0)
		{
			playerMovementScript.currentGun.GetComponent(GunScript).beingHeld = false;
			playerMovementScript.currentGun.GetComponent(GunScript).countToThrow = 2;
			playerMovementScript.currentGun = gameObject;
			beingHeld = true;
			targetYRotation = cameraObject.GetComponent(MouseLookScript).yRotation - 180;
			playerMovementScript.waitFrameForSwitchGuns = 2;
		}
	}
}

function OnGUI ()
{
	if(beingHeld)
	{
		for(var i : int = 1; i <= currentClip; i++)
		{
			GUI.DrawTexture(Rect(ammoStartX + ((i-1) * (ammoSize.x + ammoSpacing)), ammoY, ammoSize.x, ammoSize.y), bulletHudTexture);
		}
		GUI.Label(ammoCountRectangle, currentExtraAmmo.ToString());
		//if(ammoDecorationTexture)
			GUI.DrawTexture(ammoDecorationHudRect, ammoDecorationTexture);
	}
}