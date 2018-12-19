import unittest
import hand_eval as hm

class test_eval_class(unittest.TestCase):

    def test_straight_plain(self):
        cards = [hm.Card(5,1),hm.Card(6,2),hm.Card(7,3),hm.Card(8,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.is_straight(cards,hv)
        boool  = hv.str_value == 9
        self.assertTrue(boool)

    def test_straight_acelow(self):
        cards = [hm.Card(5,1),hm.Card(4,2),hm.Card(3,3),hm.Card(2,4),hm.Card(13,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.is_straight(cards,hv)
        boool  = hv.str_value == 5
        self.assertTrue(boool)

    def test_straight_longer(self):
        cards = [hm.Card(5,1),hm.Card(6,2),hm.Card(7,3),hm.Card(8,4),hm.Card(9,1),hm.Card(11,2),hm.Card(10,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.is_straight(cards,hv)
        boool = hv.str_value == 11
        self.assertTrue(boool)

    def test_straight_shorter(self):
        cards = [hm.Card(4,1),hm.Card(6,2),hm.Card(7,3),hm.Card(8,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.is_straight(cards,hv)
        boool = hv.str_value == None
        self.assertTrue(boool)

    def test_flush(self):
        cards = [hm.Card(5,3),hm.Card(6,3),hm.Card(7,3),hm.Card(8,3),hm.Card(9,3),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.check_flush(cards,hv)
        boool  = hv.flush_value == 9 and hv.flush_suit ==3
        self.assertTrue(boool)

    def test_straight_flush(self):
        cards = [hm.Card(5,3),hm.Card(6,3),hm.Card(7,3),hm.Card(8,3),hm.Card(9,3),hm.Card(10,3),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        hm.check_flush(cards,hv)
        boool  = hv.str_flush_value== 10 and hv.str_flush_suit ==3
        self.assertTrue(boool)

    def test_quad(self):
        cards = [hm.Card(5,3),hm.Card(5,2),hm.Card(5,1),hm.Card(5,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        sames = hm.get_sames(cards)
        hm.check_max_same(sames,hv)
        boool  = hv.quads_value == 5
        self.assertTrue(boool)

    def test_trips(self):
        cards = [hm.Card(5,3),hm.Card(5,2),hm.Card(5,1),hm.Card(13,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        sames = hm.get_sames(cards)
        hm.check_max_same(sames,hv)
        boool = hv.triple_value == 5
        self.assertTrue(boool)

    def test_full_house(self):
        cards = [hm.Card(9,3),hm.Card(5,2),hm.Card(5,1),hm.Card(5,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        sames = hm.get_sames(cards)
        hm.check_max_same(sames,hv)
        boool  = hv.fullhouse_trip_value==5 and hv.fullhouse_pair_value==9
        self.assertTrue(boool)

    def test_two_pair(self):
        cards = [hm.Card(3,3),hm.Card(3,2),hm.Card(5,1),hm.Card(5,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        sames = hm.get_sames(cards)
        hm.check_max_same(sames,hv)
        boool  = hv.twopair_high_value==5 and hv.twopair_low_value==3
        self.assertTrue(boool)

    def test_pair(self):
        cards = [hm.Card(12,3),hm.Card(4,2),hm.Card(5,1),hm.Card(5,4),hm.Card(9,1),hm.Card(11,2),hm.Card(2,3)]
        cards.sort(key= lambda hand: hand.pic)
        hv = hm.Hand_Value()
        sames = hm.get_sames(cards)
        hm.check_max_same(sames,hv)
        boool  = hv.pair_value==5
        self.assertTrue(boool)
