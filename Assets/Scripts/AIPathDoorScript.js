
var cells = new Array();
var doorsToCells = new Array();
var inmediateCells = new Array();
var testForCells : boolean = true;
var waitToTestCells : float = 2;
var stage : int = 1;

var animatedDoor : GameObject;
@HideInInspector
var doorOpen : boolean = true;

function Awake () 
{
	doorOpen = true;
	cells = GameObject.FindGameObjectsWithTag("AIPathCell");
	doorsToCells.length = cells.length;
	testForCells = true;
	waitToTestCells = 2;
	stage = 1;
}

function Update () 
{
	if(animatedDoor)
		doorOpen = animatedDoor.GetComponent(DoorScript).open;

	if(testForCells && waitToTestCells <= 0)
	{
		for (var inmediateCell : GameObject in inmediateCells)
        {
            for (var i : int = 0; i <= cells.length - 1; i++)
            {
                if (cells[i] == inmediateCell)
                    doorsToCells[i] = 1;
            }
        }   
        for (stage = 2; stage <= cells.length; stage++)
        {
            for (i = 0; i <= cells.length - 1; i++)
            {
                if (doorsToCells[i] == stage - 1)
                    for (var checkDoor : GameObject in cells[i].GetComponent(AIPathCellScript).doors)
                    {
                        if (checkDoor != gameObject)
                        {
                            for (var checkCell : GameObject in checkDoor.GetComponent(AIPathDoorScript).inmediateCells)
                            {
                                for (var j : int = 0; j <= cells.length - 1; j++)
                                {
                                    if (cells[j] == checkCell && doorsToCells[j] == null)
                                        doorsToCells[j] = stage;
                                }
                            }
                        }
                    }
            }
        }	
		testForCells = false;
		//Debug.Log(doorsToCells);
	}
	waitToTestCells -= 1;

}

function OnTriggerEnter(other : Collider)
{
		if(other.tag=="AIPathCell")
			inmediateCells.Add(other.gameObject);
}