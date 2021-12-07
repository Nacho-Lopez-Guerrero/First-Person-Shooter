var doors = new Array();

function Start () {
}

function Update () {
}

function OnTriggerEnter(other : Collider)
{
	if(other.tag=="AIPathDoor")
		doors.Add(other.gameObject);
}