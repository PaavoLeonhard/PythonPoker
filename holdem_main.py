class Card:
    def __init__(self,pic, suit):
        self.pic = pic
        self.suit = suit

    def __getitem__(self,index):
        return self.pic[index]

class Hand_Value:
    def __init__(self):
        self.str_flush_value = None 
        self.str_flush_suit = None 

        self.quads_value = None 

        self.fullhouse_trip_value = None 
        self.fullhouse_pair_value = None 

        self.flush_value = None 
        self.flush_suit = None 
        self.str_value = None 

        self.triple_value = None 

        self.twopair_high_value = None 
        self.twopair_low_value = None 

        self.pair_value = None 

        self.highest_card = None

    
    def hand_strenght():
        if self.str_flush_value != None:
            value_score =  90000 + self.str_flush_value * 100
            return((value_score, "You have got a straight flush with the highest card "+ str(Card(self.str_flush_value, self.str_flush_suit))))

        if self.quads != None:
            value_score = 80000 + self.quads_value
            return( (value_score, "You have got " + str(self.quads_value) + " Quads") )

        if self.fullhouse_trip_value != None:
            value_score = 70000 + self.fullhouse_trip_value * 100 +  self.fullhouse_pair_value
            return( (value_score, "You have got a FullHouse " + str(self.fullhouse_trip_value) + " and "+ str(self.fullhouse_pair_value)) )

        if self.flush_value != None:
            value_score =  60000 + self.flush_value * 100
            return( (value_score, "You have got a flush with the highest card "+ (self.flush_value, )) )

        if self.str_value != None:
            value_score =  50000 + self.str_value * 100
            return( (value_score, "You have got a straight with the highest card "+ (self.str_value, )) )

        if self.triple_value != None:
            value_score = 40000 + self.triple_value
            return( (value_score, "You have got " + str(self.triple_value) + " Triples") )

        if self.twopair_high_value != None:
            value_score = 30000 + self.twopair_high_value * 100 +  self.twopair_low_value
            return( (value_score, "You have got " + str(self.twopair_high_value) + " Pair") )

        if self.pair_value != None:
            value_score = 20000 + self.pair_value
            return( (value_score, "You have got " + str(self.pair_value) + " Pairs") )









class Result:
    def __init__(self,value, highest_card):
        self.value = value
        self.highest_card =highest_card

def check_value_hand(hand, flop):
    hand.append(flop[0])
    hand.append(flop[1])
    hand.sort(key= lambda hand: hand.pic)
    hand_value = Hand_Value()

    sames = get_sames(hand)
    max_sames = check_max_same(sames)
    hand_value.
    print("Max Sames: " + str(max_sames))
    
    print("Flush: "+ str(check_flush(hand)))
    
    print("Straight: " + str(is_straight(hand)))
    
    #check for trips,two pair, for pair and highest card

def check_max_same(sames):
    sames.sort(key= lambda sames: len(sames), reverse=True)
    if len(sames) ==0:
        return "No double in this Hand"
    if len(sames[0]) == 4:
        return "QUUUUAAADS"
    if len(sames) > 1:
        if len(sames[0])==3 and len(sames[1])> 1:
            return "Full House"
    if len(sames[0])==3:
        return "Trips"    
    if len(sames) > 1:
        if len(sames[0])==2 and len(sames[1])==2:
            return "Two pair"
    if len(sames[0])==2:
        return "Pair"

def check_flush(hand):
    for suit_num in range(4):
        ress = is_flush(hand, 1) + is_flush(hand, 2) +is_flush(hand, 3) + is_flush(hand, 4)
        return ress
        if ress== 1:
            res = is_straight(ress)

def is_flush(hand,suit):
    flush = []
    for x in range(len(hand)):
        if hand[x].suit==suit:
            flush.append(hand[x])
    if len(flush) > 4:
        return 1
    else:
        return 0

def is_straight(hand):
    count = 1
    for x in range(len(hand)-1):
        if (hand[x+1].pic -hand[x].pic)==1:
            count = count + 1
            if count > 4:
                return 1
        else:
            count= 1
    #check for special case ace,2,3,4,5
    if hand[6]==13 and hand[0]==2 and hand[1]==3 and hand[2]==4 and hand[3]==5:
        return 1
    return 0

#returns of all the doubles, trips and quads in the given hand within a list
def get_sames(hand):
    reference = hand[0]
    simple_list = []
    uber_list = []
    for x in range((len(hand)-1)):
        #only if the cards have the same value
        reference = hand[x]
        simple_list.append(reference)
        if (reference.pic != hand[x + 1].pic):
            if (len(simple_list) > 1):
                uber_list.append(simple_list)
                simple_list = []
            else:
                simple_list = []
    if reference.pic == hand[6].pic:
        simple_list.append(reference)
    if  (len(simple_list) > 1):
        uber_list.append(simple_list)
    return uber_list

def create_deck():
    deck = []
    for x in range(13):
        deck.append(Card(x+1,1))
        deck.append(Card(x+1,2))
        deck.append(Card(x+1,3))
        deck.append(Card(x+1,4))
    return deck

def numbers_to_names(card):
    picture_dictonary = {11:"Jack",12:"Queen",13:"King",14:"Ace"}
    suit_dictonary = {1:"Heart",2:"Diamond",3:"Spades",4:"Cross"}
    return str(picture_dictonary.get(card.pic, card.pic))+ " of " + str(suit_dictonary.get(card.suit, "No Suit? That is probably wrong :("))


flop = []
hand = []
flop.append(Card(9,1))
flop.append(Card(3,1))
flop.append(Card(4,1))
flop.append(Card(5,3))
flop.append(Card(6,1))
hand.append(Card(7,1))
hand.append(Card(9,4))
print("Start")
print(check_value_hand(flop, hand))
print("Ende")
