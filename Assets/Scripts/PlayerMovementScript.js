
var walkAcceleration : float = 700;
var walAccelAirRatio : float = 0.2;
var walkDeacceleration : float = 0.2;
@HideInInspector
var walkDeaccelerationVolx : float;
@HideInInspector
var walkDeaccelerationVolz : float;
var cameraObject : GameObject;
var maxWalkSpeed : float = 1000;
@HideInInspector
var horizontalMovement : Vector2;
var jumpVelocity : float = 300;

var grounded : boolean = false;	
var maxSlope : float = 60;

var crouchRatio : float = 0.55;
var transitionToCrouchSecs : float = 0.2;
var crouchingVelocity : float; 
var currentCrouchRatio : float = 1;
var originalLocalScaleY : float;
var crouchLocalScaleY : float;
var collisionDetectionSphere : GameObject;

var currentGun : GameObject;
var distToPickUpGun : float = 6;
var throwGunUpForce : float = 1000;
var throwGunForwardForce : float = 3000;
var waitFrameForSwitchGuns : int = -1;

var currentCell : GameObject;

var health : float = 100;
var deadBodyPrefab : GameObject;


function Awake()
{
	currentCrouchRatio = 1;
	originalLocalScaleY = transform.localScale.y;
	crouchLocalScaleY = transform.localScale.y * crouchRatio;
}

function Start () {
	
}

function Update () 
{
		
	if(grounded)
		rigidbody.useGravity = false;
	else 
		rigidbody.useGravity = true;
	
	waitFrameForSwitchGuns -= 1;	
	
	transform.localScale.y = Mathf.Lerp(crouchLocalScaleY, originalLocalScaleY, currentCrouchRatio);
	if(Input.GetButton("Crouch"))
		currentCrouchRatio = Mathf.SmoothDamp(currentCrouchRatio, 0, crouchingVelocity, transitionToCrouchSecs);
	if(!Input.GetButton("Crouch") && collisionDetectionSphere.GetComponent(CollisionDetectionSphereScript).collisionDetected == false)
		currentCrouchRatio = Mathf.SmoothDamp(currentCrouchRatio, 1, crouchingVelocity, transitionToCrouchSecs);
	
	horizontalMovement = Vector2(rigidbody.velocity.x, rigidbody.velocity.z);
	if(horizontalMovement.magnitude > maxWalkSpeed)
	{
		horizontalMovement = horizontalMovement.normalized;
		horizontalMovement *= maxWalkSpeed;
	}
	rigidbody.velocity.x = horizontalMovement.x;
	rigidbody.velocity.z = horizontalMovement.y;
	
	//if(grounded)
	//{
	//	rigidbody.velocity.x = Mathf.SmoothDamp(rigidbody.velocity.x, 0, walkDeaccelerationVolx, walkDeacceleration);
	//	rigidbody.velocity.z = Mathf.SmoothDamp(rigidbody.velocity.z, 0, walkDeaccelerationVolz, walkDeacceleration);
	//}
	
	transform.rotation = Quaternion.Euler(0, cameraObject.GetComponent(MouseLookScript).currentYRotation, 0);
	
	//Movimiento direccional
	//if(grounded)
	//	rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration * Time.deltaTime, 0, Input.GetAxis("Vertical") * walkAcceleration * Time.deltaTime);
	//else
	//	rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration * walAccelAirRatio * Time.deltaTime, 0, Input.GetAxis("Vertical") * walkAcceleration * walAccelAirRatio * Time.deltaTime);
	
	if(Input.GetButtonDown("Jump") && grounded)
		rigidbody.AddForce(0, jumpVelocity, 0);
    
    if (health <= 0)
    {
        currentGun.GetComponent(GunScript).beingHeld = false;
        currentGun.rigidbody.AddRelativeForce(Vector3(0, throwGunUpForce, throwGunForwardForce));
        Instantiate(deadBodyPrefab, transform.position, transform.rotation);
        collider.enabled = false;
        cameraObject.GetComponent(AudioListener).enabled = false;
        enabled = false;
    }
}

function FixedUpdate()
{
	if(grounded)
		rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration, 0, Input.GetAxis("Vertical") * walkAcceleration);
	else
		rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * walkAcceleration * walAccelAirRatio, 0, Input.GetAxis("Vertical") * walkAcceleration * walAccelAirRatio);
	if(grounded)
	{
		rigidbody.velocity.x = Mathf.SmoothDamp(rigidbody.velocity.x, 0, walkDeaccelerationVolx, walkDeacceleration);
		rigidbody.velocity.z = Mathf.SmoothDamp(rigidbody.velocity.z, 0, walkDeaccelerationVolz, walkDeacceleration);
	}
}

function OnCollisionStay (collision : Collision)
{
	for(var contact : ContactPoint in collision.contacts)
	{
		if(Vector3.Angle(contact.normal, Vector3.up) < maxSlope)
			grounded = true;
	}
}

function OnCollisionExit()
{
	grounded = false;

}

function OnTriggerExit()
{
	currentCell = null;
}

function OnTriggerStay(hitTrigger : Collider)
{
	if(hitTrigger.tag == "AIPathCell")
		currentCell = hitTrigger.gameObject;
	
	if(hitTrigger.transform.tag == "StairGoingUp")
		if(!Input.GetButton("Jump") && Vector3.Angle(rigidbody.velocity, hitTrigger.transform.forward) < 90)
			if(rigidbody.velocity.y > 0)
				rigidbody.velocity.y = 0;
	if(hitTrigger.transform.tag == "StairGoingDown")
		if(!Input.GetButton("Jump") && Vector3.Angle(rigidbody.velocity, hitTrigger.transform.forward) < 90)
			rigidbody.AddForce(0,-100,0);
	
	var current : GunScript = null;
	
	if(currentGun)
		current = currentGun.GetComponent(GunScript);
	var ammo : AmmoPickUpScript = null;
	var gun : GunScript = null;
	if(hitTrigger.tag == "Ammo PickUp")
	{
		ammo = hitTrigger.gameObject.GetComponent(AmmoPickUpScript);
		//Si podemos coger mas municion
		if(current.currentExtraAmmo < current.maxExtraAmmo)
		{
			if(ammo.fromGun == true)
			{
				gun = ammo.gun.GetComponent(GunScript);
				//Si podemos coger municion del arma en el suelo (el arma usa la misma municion y no es la misma arma)
				if(gun.currentExtraAmmo > 0 && gun.ammoType == current.ammoType && ammo.gun != currentGun)
				{
					//Si la municion encontrada llena la "mochila"
					if(gun.currentExtraAmmo >= current.maxExtraAmmo - current.currentExtraAmmo)
					{
						gun.currentExtraAmmo -= current.maxExtraAmmo - current.currentExtraAmmo;
						current.currentExtraAmmo = current.maxExtraAmmo;
						if(ammo.gameObject.GetComponent(AudioSource))
							ammo.gameObject.GetComponent(AudioSource).Play();
					}
					//Si no hay sufieciente ammo para llenar la mochila (cogemos toda)
					if(gun.currentExtraAmmo < current.maxExtraAmmo - current.currentExtraAmmo)
					{					
						current.currentExtraAmmo += gun.currentExtraAmmo;
						gun.currentExtraAmmo = 0;
						if(ammo.gameObject.GetComponent(AudioSource))
							ammo.gameObject.GetComponent(AudioSource).Play();
					}
				}
			}
			if(!ammo.fromGun)
			{
				//Si podemos coger municin de la caja de municion
				if(current.ammoType == ammo.ammoType || ammo.ammoType == -1)
				{
					if(ammo.ammoAmount > 0 && !ammo.unlimitedAmmo)
					{
						if(ammo.ammoAmount >= current.maxExtraAmmo - current.currentExtraAmmo)
						{
							ammo.ammoAmount -= current.maxExtraAmmo - current.currentExtraAmmo;
							current.currentExtraAmmo = current.maxExtraAmmo;
							if(ammo.gameObject.GetComponent(AudioSource))
								ammo.gameObject.GetComponent(AudioSource).Play();
						}
			
						if(ammo.ammoAmount < current.maxExtraAmmo - current.currentExtraAmmo)
						{					
							current.currentExtraAmmo += ammo.ammoAmount;
							ammo.ammoAmount = 0;
							if(ammo.gameObject.GetComponent(AudioSource))
								ammo.gameObject.GetComponent(AudioSource).Play();
						}
						if(ammo.unlimitedAmmo)
						{
							current.currentExtraAmmo = current.maxExtraAmmo;
							if(ammo.gameObject.GetComponent(AudioSource))
								ammo.gameObject.GetComponent(AudioSource).Play();
						}
					}
				}
			}
		}
	}		
}