


var currentCell : GameObject;
var playerMovementScript : PlayerMovementScript;
var playerCell : GameObject;
var goalDoor : GameObject;
var shortestPathSoFar : float;
@HideInInspector
var waitToStart : int = 5;
var currentMoveSpeed : float = 7;
var maxMoveSpeed : float = 7;
var minMoveSpeed : float = 1;
var speedRecover : float = 2;
var speedDamage : float = 0.5;

var playerTransform : Transform;

var randomizedCourse : boolean = false;
var randomizedCourseVector : Vector3;
var calculatedNewRandomizedCourseVector : boolean;

var lastPos : Vector3;

var viewAngle : float = 60;
var aware : boolean = false;
var unawareSpeed : float = 3;

function Awake () 
{
    shortestPathSoFar = Mathf.Infinity;
    playerMovementScript = GameObject.FindWithTag("Player").GetComponent(PlayerMovementScript);
    playerTransform = GameObject.FindWithTag("Player").transform;
    waitToStart = 5;
    randomizedCourseVector = transform.position;
    lastPos = transform.position;
    aware = false;
}

function LateUpdate () 
{
	//En goalDoor se guarda la posicion (puerta) hacia donde esta el jugador
    if (waitToStart <= 0)
    {
        playerCell = playerMovementScript.currentCell;
        for (var doorCheckingNow : GameObject in currentCell.GetComponent(AIPathCellScript).doors)
        {
            for (var i : int = 0; i <= doorCheckingNow.GetComponent(AIPathDoorScript).cells.length - 1; i++)
            {
                if (doorCheckingNow.GetComponent(AIPathDoorScript).cells[i] == playerCell)
                if (doorCheckingNow.GetComponent(AIPathDoorScript).doorsToCells[i] < shortestPathSoFar)
                {
                    goalDoor = doorCheckingNow;
                    shortestPathSoFar = doorCheckingNow.GetComponent(AIPathDoorScript).doorsToCells[i];
                }
            }
        }
        shortestPathSoFar = Mathf.Infinity;
    }
    waitToStart -= 1;
    
    //Comprobamos si este enemigo ve al jugador
    var hits : RaycastHit[];
    var anyHit : boolean = false;
    if(Vector3.Angle(transform.forward, playerTransform.position - transform.position) < viewAngle / 2 && !aware)
    {
    	hits = Physics.SphereCastAll(transform.position, transform.localScale.x / 3, playerTransform.position - transform.position, Vector3.Distance(transform.position, playerTransform.position));
    	for(var hit : RaycastHit in hits)
    	{
    		if(hit.transform.tag == "Level Parts")
    			anyHit = true;
    	}
    	//Si nava obstaculiza la vista, lo esta viendo
    	if(anyHit == false)
 			aware = true;
 		//else 
 			//aware = false;   		
    }
    
    if(!aware)
    	goalDoor = null;
    
    if(!calculatedNewRandomizedCourseVector)
    {
    	randomizedCourseVector = FindRandomSpotInCurrentCell();
    	calculatedNewRandomizedCourseVector = true;
    }
    
    if (goalDoor)
    if (!goalDoor.GetComponent(AIPathDoorScript).doorOpen)
        goalDoor = null;
        
	if (currentCell != playerCell || playerCell == null || !aware)
    {
        if ((randomizedCourse && goalDoor) )//|| (aware && goalDoor)) //Condiciones aware en los dos if siguientes añadidas por mi
        {
            transform.position += (goalDoor.transform.position - transform.position).normalized * currentMoveSpeed * Time.deltaTime;
        	//randomizedCourse = true;	//Añadido por mi
        }
        if (!randomizedCourse) //&& !aware)
        {
            transform.position += (randomizedCourseVector - transform.position).normalized * currentMoveSpeed * Time.deltaTime;
            if (Vector3.Distance(transform.position, randomizedCourseVector) < transform.localScale.x)
            {
                if (goalDoor)
                    randomizedCourse = true;
                if (goalDoor == null)
                    calculatedNewRandomizedCourseVector = false;
            }
        }
    }
    
    if(playerCell == currentCell && aware)
        transform.position += (playerTransform.position - transform.position).normalized * currentMoveSpeed * Time.deltaTime;

	if(currentMoveSpeed < maxMoveSpeed && aware)
		currentMoveSpeed += speedRecover * Time.deltaTime;	
	if(currentMoveSpeed >= maxMoveSpeed && aware)
		currentMoveSpeed = maxMoveSpeed;
	
	if(currentMoveSpeed < unawareSpeed && !aware)
		currentMoveSpeed += speedRecover * Time.deltaTime;	
	if(currentMoveSpeed >= unawareSpeed && !aware)
		currentMoveSpeed = unawareSpeed;
	
	//Pone a mirar al enemigo hacia la misma direccion que se mueve
	transform.rotation = Quaternion.LookRotation(transform.position - lastPos);
    lastPos = transform.position;	
}

function OnTriggerEnter(hitTrigger : Collider)
{
	if(hitTrigger.tag == "AIPathCell")
	{	
		currentCell = hitTrigger.gameObject;
		randomizedCourse = false;
		calculatedNewRandomizedCourseVector = false;
	}
}

function OnTriggerStay(hitTrigger : Collider)
{
	if(hitTrigger.tag == "Enemy" && hitTrigger.gameObject != gameObject)
	{
		if(currentMoveSpeed > minMoveSpeed)
			currentMoveSpeed -= speedDamage;
		transform.position += (transform.position - hitTrigger.transform.position).normalized * 0.5;
	}

}


//Devuelve un punto aleatorio en la celda donde se encuentra el Enemigo (this.transform)
function FindRandomSpotInCurrentCell()
{
	var resultado : Vector3 = currentCell.transform.position + (currentCell.transform.rotation * Vector3(Random.Range(currentCell.transform.localScale.x * -0.5,currentCell.transform.localScale.x * 0.5),0,Random.Range(currentCell.transform.localScale.z * -0.5,currentCell.transform.localScale.z * 0.5)));
	//Debug.Log(resultado);
	return resultado;
}