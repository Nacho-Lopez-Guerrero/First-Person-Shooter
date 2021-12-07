var enemyBody : GameObject;
var addForceVector : Vector3;
var damageMultiplyer : float = 1;	//Para hacer mas daño en esta parte del cuerpo
 
 
function LateUpdate () 
{
    if (addForceVector != Vector3.zero && !enemyBody.GetComponent(EnemyBodyScript).enabled)
    {
        if (rigidbody)
            rigidbody.AddForce(addForceVector);
        else
            transform.parent.rigidbody.AddForce(addForceVector);
        addForceVector = Vector3.zero;
    }
}