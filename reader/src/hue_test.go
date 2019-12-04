package main

import (
	"testing"

	"github.com/tidwall/gjson"
)

var userId string = "newdeveloper"
var localIpPort string = "localhost:8000"

func TestMakeIDrightPort(t *testing.T) {
	value := makeID(localIpPort)
	if len(value) == 0 {
		t.Error("Expected to get ID but it can't get it")
	}
}

func TestGetBulbs(t *testing.T) {
	value := getBulbs(userId, localIpPort)
	message := gjson.Get(value, "1").String()
	if len(message) == 0 {
		t.Error("Expected to get first bulbs message but it can't")
	}
}

func TestGetBulbsWrongID(t *testing.T) {
	value := getBulbs("id", localIpPort)
	message := gjson.Get(value, "error").String()
	if len(message) != 0 {
		t.Error("Expected to get error message but it get other")
	}
}

func TestOnOFFLightOn(t *testing.T) {
	value := OnOFFLight(userId, localIpPort, true, 1)
	message := gjson.Get(value, "#.success").String()
	if len(message) == 0 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestOnOFFLightOff(t *testing.T) {
	value := OnOFFLight(userId, localIpPort, false, 1)
	message := gjson.Get(value, "#.success").String()
	if len(message) == 0 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestOnOFFLightOffWrongBulb(t *testing.T) {
	value := OnOFFLight(userId, localIpPort, false, 0)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestOnOFFLightOffWrongId(t *testing.T) {
	value := OnOFFLight("id", localIpPort, false, 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestOnOFFGroupLightOn(t *testing.T) {
	value := OnOFFGroupLight(userId, localIpPort, true, 1)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestOnOFFGroupLightOff(t *testing.T) {
	value := OnOFFGroupLight(userId, localIpPort, false, 1)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestOnOFFGroupLightWrongGroup(t *testing.T) {
	value := OnOFFGroupLight(userId, localIpPort, true, 0)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestOnOFFGroupLightWrongId(t *testing.T) {
	value := OnOFFGroupLight("id", localIpPort, true, 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestCreateGroupNormal(t *testing.T) {
	lightGruop := []int{1, 2}
	value := createGroup(userId, localIpPort, "group", lightGruop)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestCreateGroupWrongbulb(t *testing.T) {
	lightGruop := []int{1, 0}
	value := createGroup(userId, localIpPort, "group", lightGruop)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		//t.Error("Expected to get error message but it didn't")
		t.Error(message)
	}
}

func TestCreateGroupEmptyName(t *testing.T) {
	lightGruop := []int{1, 2}
	value := createGroup(userId, localIpPort, "", lightGruop)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestCreateGroupWrongId(t *testing.T) {
	lightGruop := []int{1, 2}
	value := createGroup("id", localIpPort, "", lightGruop)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeBrightBiggestBri(t *testing.T) {
	value := changeBright(userId, localIpPort, 1, 254)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestChangeBrightSmallestBri(t *testing.T) {
	value := changeBright(userId, localIpPort, 1, 0)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestChangeBrightWrongBri(t *testing.T) {
	value := changeBright(userId, localIpPort, 1, -1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeBrightOverBri(t *testing.T) {
	value := changeBright(userId, localIpPort, 1, 300)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeBrightWrongBulb(t *testing.T) {
	value := changeBright(userId, localIpPort, 0, 254)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeBrightWrongId(t *testing.T) {
	value := changeBright("id", localIpPort, 1, 254)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestModifyGroupEmptyName(t *testing.T) {
	bulbs := []int{1, 2}
	value := modifyGroup(userId, localIpPort, "", 1, bulbs)
	message := gjson.Get(value, "#.success").String()
	if len(message) <= 2 {
		t.Error("Expected to get success message but it didn't")
	}
}

func TestModifyGroupWrongBulb(t *testing.T) {
	bulbs := []int{0, 1}
	value := modifyGroup(userId, localIpPort, "group", 1, bulbs)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestModifyGroupWrongGroupId(t *testing.T) {
	bulbs := []int{1, 2}
	value := modifyGroup(userId, localIpPort, "group", 0, bulbs)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestModifyGroupWrongId(t *testing.T) {
	bulbs := []int{1, 2}
	value := modifyGroup("id", localIpPort, "group", 1, bulbs)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestGetGroupNormal(t *testing.T) {
	value := getGroup(userId, localIpPort, 1)
	message := gjson.Get(value, "name").String()
	if len(message) == 0 {
		t.Error("Expected to get message after success but it didn't")
	}
}

func TestGetGroupWrongGroupId(t *testing.T) {
	value := getGroup(userId, localIpPort, 0)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestGetGroupWrongId(t *testing.T) {
	value := getGroup("id", localIpPort, 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeColourColourBulb(t *testing.T) {
	value, failed := changeColour(userId, localIpPort, "#613143", 1)
	message := gjson.Get(value, "#.error").String()
	if len(failed) != 0 || len(message) != 2 {
		t.Error("Expected to get successfully change colour but it didn't")
	}
}

func TestChangeColourLuxBulb(t *testing.T) {
	value, failed := changeColour(userId, localIpPort, "#613143", 8)
	message := gjson.Get(value, "#.error").String()
	if len(failed) == 0 || len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeColourWrongBulb(t *testing.T) {
	value, _ := changeColour(userId, localIpPort, "#613143", 0)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeColourWrongId(t *testing.T) {
	value, _ := changeColour("id", localIpPort, "#613143", 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeColourWrongHex(t *testing.T) {
	value, _ := changeColour(userId, localIpPort, "#6131435", 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeGroupColourNormal(t *testing.T) {
	value := changeGroupColour(userId, localIpPort, "#613143", 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) != 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeGroupColourWrongGroup(t *testing.T) {
	value := changeGroupColour(userId, localIpPort, "#613143", 0)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeGroupColourWrongId(t *testing.T) {
	value := changeGroupColour("id", localIpPort, "#613143", 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) <= 2 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestChangeGroupColourWrongHex(t *testing.T) {
	value := changeGroupColour(userId, localIpPort, "#613143", 1)
	message := gjson.Get(value, "#.error").String()
	if len(message) == 0 {
		t.Error("Expected to get error message but it didn't")
	}
}

func TestmakeUserID(t *testing.T) {
	value := MakeUserID(localIpPort)
	if value == "newdeveloper" {
		t.Error("Expected to get error message but it didn't")
	}
}
