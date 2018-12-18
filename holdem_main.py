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
            return((value_score, "You  got a straight flush with the highest card "+ str(Card(self.str_flush_value, self.str_flush_suit))))

        if self.quads != None:
            value_score = 80000 + self.quads_value
            return( (value_score, "You  got " + str(self.quads_value) + " Quads") )

        if self.fullhouse_trip_value != None:
            value_score = 70000 + self.fullhouse_trip_value * 100 +  self.fullhouse_pair_value
            return( (value_score, "You  got a FullHouse " + str(self.fullhouse_trip_value) + " and "+ str(self.fullhouse_pair_value)) )

        if self.flush_value != None:
            value_score =  60000 + self.flush_value * 100
            return( (value_score, "You got a flush with the highest card "+ (self.flush_value, )) )

        if self.str_value != None:
            value_score =  50000 + self.str_value * 100
            return( (value_score, "You got a straight with the highest card "+ (self.str_value, )) )

        if self.triple_value != None:
            value_score = 40000 + self.triple_value
            return( (value_score, "You got " + str(self.triple_value) + " Triples") )

        if self.twopair_high_value != None:
            value_score = 30000 + self.twopair_high_value * 100 +  self.twopair_low_value
            return( (value_score, "You got " + str(self.twopair_high_value) + " Pair") )

        if self.pair_value != None:
            value_score = 20000 + self.pair_value
            return( (value_score, "You got " + str(self.pair_value) + " Pairs") )


def check_value_hand(hand, flop):
    hand.append(flop[0])
    hand.append(flop[1])
    hand.sort(key= lambda hand: hand.pic)
    hv = Hand_Value()
    sames = get_sames(hand)
    max_sames = check_max_same(sames, hv)
    print("Max Sames: " + str(max_sames))
    print("Flush: "+ str(check_flush(hand, hv)))
    print("Straight: " + str(is_straight(hand, hv)))
    #check for trips,two pair, for pair and highest card

def check_max_same(sames, hand_value):
    sames.sort(key= lambda sames: len(sames), reverse=True)
    if len(sames) ==0:
        return "No double in this Hand"
    if len(sames[0]) == 4:
        hand_value.quads_value(sames[0][0].pic)
        return "QUUUUAAADS"
    if len(sames) > 1:
        if len(sames[0])==3 and len(sames[1])> 1:
            hand_value.fullhouse_trip_value = sames[0][0].pic
            hand_value.fullhouse_pair_value = sames[1][0].pic
            return "Full House"
    if len(sames[0])==3:
        hand_value.triple_value = sames[0][0].pic
        return "Trips"    
    if len(sames) > 1:
        if len(sames[0])==2 and len(sames[1])==2:
            #for some reason low comes before high which brings the annoying problem of boundaries...
            hand_value.twopair_low_value = sames[0][0].pic
            hand_value.twopair_high_value = sames[1][0].pic
            return "Two pair"
    if len(sames[0])==2:
        hand_value.pair_value = sames[0][0].pic
        return "Pair"

def check_flush(hand, hand_value):
    ress = []
    for suit_num in range(4):
        ress =is_flush(ress,hand, 1, hand_value)
        ress =is_flush(ress,hand, 2, hand_value)
        ress =is_flush(ress,hand, 3, hand_value)
        ress =is_flush(ress,hand, 4, hand_value)
        ress = [x for x in ress if x is not None]
        
        if ress!= None:
            is_straight(ress, hand_value)
        return ress

def is_flush(ress,hand,suit, hand_value):
    flush = []
    highest_card = None
    for x in range(len(hand)):
        if hand[x].suit==suit:
            flush.append(hand[x])
            highest_card = hand[x]
    if len(flush) > 4:
        #hopefully has the highest Card Value
        hand_value.flush_value = highest_card.pic
        hand_value.flush_suit = highest_card.suit
        ress.append(flush)
        ress = ress[0]
    return ress

#TODO throw out doubl go from top to bottom
def is_straight(verbose_hand, hand_value):
    hand = throw_out_sames(verbose_hand)
    count = 1
    condition = len(hand)-1
    highest_card_in_straight = hand[condition]
    while condition > 0:
        if (hand[condition].pic - hand[condition-1].pic)==1:
            count = count + 1
            if count > 4:
                hand_value.str_value = highest_card_in_straight.pic
                #chcek for strflush
                if hand_value.flush_value!=None:
                    hand_value.str_flush_suit=highest_card_in_straight.suit
                    hand_value.str_flush_value=highest_card_in_straight.pic
                return hand_value
        else:
            count= 1
            highest_card_in_straight = hand[condition-1]
        condition = condition -1
    try:
        #check for special case ace,2,3,4,5
        if hand[-1].pic==13 and hand[0].pic==2 and hand[1].pic==3 and hand[2].pic==4 and hand[3].pic==5:
            hand_value.str_value=5
            return hand_value
        #check for special case in strflush ace,2,3,4,5
        if hand[-1].pic==13 and hand[0].pic==2 and hand[1].pic==3 and hand[2].pic==4 and hand[3].pic==5 and hand_value.flush_value != None:
            hand_value.str_flush_value =5
            return hand_value
    except:
        pass
    hand_value.str_value=None
    return hand_value

def throw_out_sames(hand):
    '''Trows out Cards with the same Value for the straight function
    '''
    reference = None
    trimmed_hand = []
    for x in range((len(hand)-1)):
        reference = hand[x]
        if (reference.pic != hand[x + 1].pic):
            trimmed_hand.append(reference)
    #Adds the last piece into the hand
    if reference.pic != hand[len(hand)-1].pic:
        trimmed_hand.append(hand[len(hand)-1])
    return trimmed_hand

def return_str_or_strflush(hand_value):
    if hand_value.flush_value > 0:
        hand_value.str_flush_value = hand_value.flush_value
    return hand_value


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

