# Jedi-survival
A Jedi Survival Game

## Objective

### Explanation

- Its a top down survival game where a jedi is trying to survive the onslaught of stormtroopers with blasters
- He can move in all directions to avoid the blasters
- He only has a light sabre that can reflect the blaster bullets back at the stormtroopers to kill them, he can also kill them close up
- The goal of the game is to survive for the longest
- Extra: add a dash 
- Extra: Different enemies with different weapons
- Extra: Make the map bigger, outside the original gamespace
- Extra: Power pickups that give him force powers (force push, etc)
- Extra: He has a multi color lightsaber, so he has to deflect the right color


### Expected Challanges

- animating the players direction
- animation of the light sabre
- stormtroopers shooting
- collision of the bullets to the jedi, or the front while deflecting
- tracking the bullets back to the original storm trooper once deflected
- tracking all the objects on the screen
- movement of the stormtroopers 
- Extra: force ability animations, multiple different types of bolts to deflect, moving the bolts while the map moves

## Wireframe

![Screenshot 2023-09-21 at 11 31 36 PM](https://github.com/JoshHutchison/Jedi-survival/assets/47956394/7849db6b-4457-4361-a525-e2125f5bdf20)

## Psuedocode

- create arena
- create player
- create timer
- have the player move around
- Have the player swing their lightsaber
- have storm troopers shoot
- Spawn stormtrooper randomly
- if bolts collide with player, they die (or lose life until health reaches 0)
- if player deflects the bolt, the stormtrooper dies
- if player swings at stormtrooper within range, the storm trooper dies
