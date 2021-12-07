#pragma strict

var floatAbove : float = 0.05;
var playerCapsuleTransform : Transform;
@HideInInspector
var collisionDetected : boolean = false;

function Start () {

}

function Update () 
{
	transform.position.x = playerCapsuleTransform.position.x;
	transform.position.z = playerCapsuleTransform.position.z;
	transform.position.y = playerCapsuleTransform.position.y + ((playerCapsuleTransform.GetComponent(CapsuleCollider).height * playerCapsuleTransform.localScale.y) / 2) + (transform.localScale.y / 2) + floatAbove;
}

function OnCollisionStay(collision : Collision)
{
	if(collision.transform.tag == "Level Parts")
		collisionDetected = true;
}

function OnCollisionExit ()
{
	collisionDetected = false;
}