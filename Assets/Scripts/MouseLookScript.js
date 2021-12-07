
var defaultCameraAngle : float = 60;
@HideInInspector
var currentTargetCameraAngle : float = 60;
@HideInInspector
var ratioZoom : float = 1;
@HideInInspector
var ratioZoomV : float;

var ratioZoomSpeed : float = 0.1;

var lookSensitivity : float = 0.5;

@HideInInspector
var yRotation : float;
@HideInInspector
var xRotation : float;
@HideInInspector
var currentYRotation : float;
@HideInInspector
var currentXRotation : float;
@HideInInspector
var yRotationV : float;
@HideInInspector
var xRotationV : float;
var lookSmoothDamp : float = 0.0;
@HideInInspector
var currentAimRatio : float = 1;

var headboobSpeed : float = 2;
@HideInInspector
var headboobStepCounter : float;
var headboobAmountX : float = 0.15;
var headboobAmountY : float = 0.075;
@HideInInspector
var parentLastPos : Vector3;
var eyeHeightRatio : float = 0.9;

function Awake()
{
	parentLastPos = transform.parent.position;
}

function Start () {

}

function Update () 
{
	//Añade Headboob
	if(transform.parent.GetComponent(PlayerMovementScript).grounded)
		headboobStepCounter += Vector3.Distance(parentLastPos, transform.parent.position) * headboobSpeed;
	transform.localPosition.x = Mathf.Sin(headboobStepCounter) * headboobAmountX * currentAimRatio;
	transform.localPosition.y = (Mathf.Cos(headboobStepCounter * 2) * headboobAmountY * currentAimRatio) + (transform.parent.localScale.y * eyeHeightRatio) - (transform.parent.localScale.y / 2);
	
	parentLastPos = transform.parent.position;
	// Recoge cantidad (ratio) de zoom a aplicar
	if(currentAimRatio == 1)	//Si no esta apuntando
		ratioZoom = Mathf.SmoothDamp(ratioZoom, 1, ratioZoomV, ratioZoomSpeed);
	else
		ratioZoom = Mathf.SmoothDamp(ratioZoom, 0, ratioZoomV, ratioZoomSpeed);

	camera.fieldOfView = Mathf.Lerp(currentTargetCameraAngle, defaultCameraAngle, ratioZoom);
	
	//Recoge posicion raton
	yRotation += Input.GetAxis("Mouse X") * lookSensitivity * currentAimRatio;	//Lee movimiento horizontal del mouse
	xRotation -= Input.GetAxis("Mouse Y") * lookSensitivity * currentAimRatio;	//Lee movimiento vertical del mouse
	
	//Limita movimiento vertical 90º
	xRotation = Mathf.Clamp(xRotation, -90, 90);
	
	//Aplica suavizado
	currentXRotation = Mathf.SmoothDamp(currentXRotation, xRotation, xRotationV, lookSmoothDamp);
	currentYRotation = Mathf.SmoothDamp(currentYRotation, yRotation, yRotationV, lookSmoothDamp);
	
	//Aplica movimiento a camara
	transform.rotation = Quaternion.Euler(currentXRotation, currentYRotation, 0);
}